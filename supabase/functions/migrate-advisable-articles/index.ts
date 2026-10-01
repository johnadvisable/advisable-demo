import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ParsedArticle {
  xmlId: string
  imageUrl?: string
  publishedDate: string
  author?: string
  languages: {
    [key: string]: {
      slug: string
      title: string
      content: string
      excerpt: string
    }
  }
}

interface MigrationStats {
  totalArticles: number
  processed: number
  insightsCreated: number
  newsCreated: number
  imagesDownloaded: number
  translationsCreated: number
  errors: number
  skipped: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sourceUrl, insightIds, newsIds } = await req.json()
    
    if (!sourceUrl || !insightIds || !newsIds) {
      throw new Error('Missing required parameters: sourceUrl, insightIds, newsIds')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Test database connection
    const { data: testData, error: testError } = await supabaseClient
      .from('languages')
      .select('id, code, is_default')
      .limit(1)

    if (testError) {
      console.error('🔥 Database connection test failed:', testError)
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    // Get language mappings
    const { data: languages, error: languagesError } = await supabaseClient
      .from('languages')
      .select('id, code, is_default')

    if (languagesError || !languages || languages.length === 0) {
      throw new Error('Failed to fetch languages from database')
    }

    const languageMap = new Map()
    let defaultLanguageId = null
    
    languages.forEach(lang => {
      languageMap.set(lang.code, lang.id)
      if (lang.is_default) defaultLanguageId = lang.id
    })

    const xmlResponse = await fetch(sourceUrl)
    if (!xmlResponse.ok) {
      throw new Error(`Failed to fetch XML: ${xmlResponse.status} ${xmlResponse.statusText}`)
    }
    const xmlText = await xmlResponse.text()
    const articles = parseXMLFeed(xmlText)

    const stats: MigrationStats = {
      totalArticles: articles.length,
      processed: 0,
      insightsCreated: 0,
      newsCreated: 0,
      imagesDownloaded: 0,
      translationsCreated: 0,
      errors: 0,
      skipped: 0
    }

    // Convert arrays to sets for faster lookup
    const insightIdsSet = new Set(insightIds)
    const newsIdsSet = new Set(newsIds)

    for (const article of articles) {
      try {
        const isInsight = insightIdsSet.has(article.xmlId)
        const isNews = newsIdsSet.has(article.xmlId)

        if (!isInsight && !isNews) {
          stats.skipped++
          continue
        }

        // Determine target table
        const targetTable = isInsight ? 'insights' : 'news'
        const translationTable = isInsight ? 'insights_translations' : 'news_translations'
        const foreignKeyField = isInsight ? 'insights_id' : 'news_id'
        // Check if article already exists (prevent duplicates)
        const { data: existingArticle } = await supabaseClient
          .from(targetTable)
          .select('id')
          .eq('slug', generateSlug(article.languages['en']?.title || article.languages['el']?.title || `article-${article.xmlId}`))
          .limit(1)

        if (existingArticle && existingArticle.length > 0) {
          stats.skipped++
          continue
        }

        // Download and save image if exists
        let savedImagePath = null
        if (article.imageUrl) {
          try {
            savedImagePath = await downloadAndSaveImage(article.imageUrl, article.xmlId, supabaseClient)
            if (savedImagePath) {
              stats.imagesDownloaded++
            }
          } catch (imgError) {
            console.error(`Failed to download image for ${article.xmlId}:`, imgError)
          }
        }

        // Get primary language content for main record
        const primaryLang = article.languages['en'] || article.languages['el'] || Object.values(article.languages)[0]
        if (!primaryLang) {
          stats.errors++
          continue
        }

        // Generate unique slug
        const baseSlug = generateSlug(primaryLang.title)
        const uniqueSlug = await generateUniqueSlug(supabaseClient, targetTable, baseSlug)

        // Prepare main record based on target table
        const mainRecord: any = {
          slug: uniqueSlug,
          published_date: article.publishedDate,
          type: 'article'
        }

        // Add author only for insights table (news table doesn't have author column)
        if (isInsight) {
          mainRecord.author = article.author || 'Advisable Team'
        }

        if (savedImagePath) {
          mainRecord.featured_image = savedImagePath
        }

        // Insert main record
        const { data: insertedRecord, error: insertError } = await supabaseClient
          .from(targetTable)
          .insert(mainRecord)
          .select('id')
          .single()

        if (insertError) {
          console.error(`❌ Failed to insert main record for ${article.xmlId}:`, insertError.message)
          stats.errors++
          continue
        }

        if (isInsight) {
          stats.insightsCreated++
        } else {
          stats.newsCreated++
        }

        // Insert translations for each language
        for (const [langCode, content] of Object.entries(article.languages)) {
          try {
            let languageId = languageMap.get(langCode)
            
            // Fallback to default language if not found
            if (!languageId) {
              languageId = defaultLanguageId
            }

            if (!languageId) {
              continue
            }

            // Check if translation already exists
            const { data: existingTranslation } = await supabaseClient
              .from(translationTable)
              .select('id')
              .eq(foreignKeyField, insertedRecord.id)
              .eq('language_id', languageId)
              .limit(1)

            if (existingTranslation && existingTranslation.length > 0) {

              const { error: updateError } = await supabaseClient
                .from(translationTable)
                .update({
                  title: content.title,
                  excerpt: content.excerpt,
                  content: content.content
                })
                .eq('id', existingTranslation[0].id)

              if (updateError) {
                console.error(`❌ Failed to update translation for ${langCode}:`, updateError.message)
              } else {
                stats.translationsCreated++
              }
            } else {
              // Insert new translation
              const translationRecord: any = {
                [foreignKeyField]: insertedRecord.id,
                language_id: languageId,
                title: content.title,
                excerpt: content.excerpt,
                content: content.content
              }

              const { error: translationError } = await supabaseClient
                .from(translationTable)
                .insert(translationRecord)

              if (translationError) {
                console.error(`❌ Failed to insert translation for ${langCode}:`, translationError.message)
              } else {
                stats.translationsCreated++
              }
            }
          } catch (translationErr) {
            console.error(`❌ Error processing translation for ${langCode}:`, translationErr)
          }
        }

        stats.processed++
        
      } catch (articleError: unknown) {
        console.error(`❌ Error processing article ${article.xmlId}:`, articleError instanceof Error ? articleError.message : String(articleError))
        stats.errors++
      }
    }


    return new Response(
      JSON.stringify({
        success: true,
        message: 'Advisable articles migration completed',
        stats
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )

  } catch (error: unknown) {
    console.error('💥 Migration failed:', error instanceof Error ? error.message : String(error))
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})

function parseXMLFeed(xmlText: string): ParsedArticle[] {
  const articles: ParsedArticle[] = []
  
  // Extract items using regex
  const itemRegex = /<item>\s*([\s\S]*?)\s*<\/item>/g
  let match
  let itemCount = 0

  while ((match = itemRegex.exec(xmlText)) !== null) {
    itemCount++
    const itemContent = match[1]
    
    // Extract basic fields
    const id = extractValue(itemContent, 'id')
    const img = extractValue(itemContent, 'image')  // Changed from 'img' to 'image'
    const date = extractValue(itemContent, 'date')
    const published = extractValue(itemContent, 'published')
    const author = extractValue(itemContent, 'author') || 'Advisable Team'
    
    if (published !== 'Y') {
      continue
    }
    
    // Extract captions with languages
    const captionsContent = extractValue(itemContent, 'captions')
    if (!captionsContent) {
      continue
    }
    
    const languages: { [key: string]: any } = {}
    
    // Split by lang sections and parse each
    const langSections = captionsContent.split(/(?=<lang>)/)
    
    for (const section of langSections) {
      if (!section.includes('<lang>')) continue
      
      const lang = extractValue(section, 'lang')?.trim()
      const slug = extractValue(section, 'slug')?.trim()
      
      // Extract CDATA content
      const titleMatch = section.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)
      const descMatch = section.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s)
      const smallDescMatch = section.match(/<smalldescription><!\[CDATA\[(.*?)\]\]><\/smalldescription>/s)
      
      if (lang && titleMatch && descMatch) {
        languages[lang] = {
          slug: slug || '',
          title: cleanTextForTitle(titleMatch[1] || ''),
          content: preserveHTMLContent(descMatch[1] || ''),
          excerpt: cleanTextForExcerpt(smallDescMatch?.[1] || titleMatch[1]?.substring(0, 200) || '')
        }
      }
    }
    
    if (Object.keys(languages).length > 0) {
      articles.push({
        xmlId: id,
        imageUrl: img?.trim() || undefined,
        publishedDate: formatDate(date),
        author: author,
        languages
      })
    }
  }
  
  return articles
}

function extractValue(content: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 's')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

// Clean text for titles and excerpts (remove HTML)
function cleanTextForTitle(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '') // Remove CDATA markers
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Clean text for excerpts (remove HTML)
function cleanTextForExcerpt(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '') // Remove CDATA markers
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Preserve HTML content for main article content
function preserveHTMLContent(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '') // Remove only CDATA markers, keep HTML
    .trim()
}

function formatDate(dateStr: string): string {
  try {
    // Try to parse the date and format as ISO string
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      // If parsing fails, return current date
      return new Date().toISOString()
    }
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}

async function generateUniqueSlug(supabaseClient: any, table: string, baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  
  while (true) {
    const { data, error } = await supabaseClient
      .from(table)
      .select('id')
      .eq('slug', slug)
      .limit(1)
    
    if (error || !data || data.length === 0) {
      break
    }
    
    slug = `${baseSlug}-${counter}`
    counter++
  }
  
  return slug
}

async function downloadAndSaveImage(imageUrl: string, articleId: string, supabaseClient: any): Promise<string | null> {
  try {
    // Add headers to mimic browser request
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    // Extract file extension
    let fileExtension = 'jpg'
    const urlParts = imageUrl.split('.')
    const urlExtension = urlParts[urlParts.length - 1]?.toLowerCase()?.split('?')[0] // Remove query params
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    
    if (validExtensions.includes(urlExtension)) {
      fileExtension = urlExtension
    } else {
      // Try to get extension from content-type
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('image/')) {
        const typeExtension = contentType.split('/')[1]?.split(';')[0]
        if (validExtensions.includes(typeExtension)) {
          fileExtension = typeExtension
        }
      }
    }
    
    // Generate filename
    const filename = `advisable-${articleId}-${Date.now()}.${fileExtension}`
    const filePath = `blog-images/${filename}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(filePath, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true // Allow overwrite
      })
    
    if (error) {
      console.error(`❌ Failed to upload image to storage: ${error.message}`)
      return null
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('images')
      .getPublicUrl(filePath)
    
    return publicUrl
    
  } catch (error: unknown) {
    console.error(`❌ Failed to download and save image: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}