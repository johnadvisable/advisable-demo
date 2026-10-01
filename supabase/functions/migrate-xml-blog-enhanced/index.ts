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
  languages: {
    [key: string]: {
      slug: string
      title: string
      content: string
      excerpt: string
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }


  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Test database connection
    const { data: testData, error: testError } = await supabaseClient
      .from('languages')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('🔥 Database connection test failed:', testError)
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    const { data: languages, error: languagesError } = await supabaseClient
      .from('languages')
      .select('id, code, is_default')

    if (languagesError) {
      console.error('🔥 Failed to fetch languages:', languagesError)
      throw new Error(`Failed to fetch languages: ${languagesError.message}`)
    }

    if (!languages || languages.length === 0) {
      throw new Error('No languages found in database')
    }

    const languageMap = new Map()
    let defaultLanguageId = null
    
    languages.forEach(lang => {
      languageMap.set(lang.code, lang.id)
      if (lang.is_default) defaultLanguageId = lang.id
    })

    // Fetch XML from advisable.com
    const xmlResponse = await fetch('https://www.advisable.com/blog/xml')
    if (!xmlResponse.ok) {
      throw new Error(`Failed to fetch XML: ${xmlResponse.status} ${xmlResponse.statusText}`)
    }
    const xmlText = await xmlResponse.text()
    // Parse XML manually (simple parsing for this structure)
    const articles = parseXMLFeed(xmlText)

    if (articles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles found to migrate',
          stats: {
            totalArticles: 0,
            processed: 0,
            errors: 0
          }
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    let processedCount = 0
    let errorCount = 0

    for (const article of articles) {
      try {

        // Download and save image if exists
        let savedImagePath = null
        if (article.imageUrl) {
          try {
            savedImagePath = await downloadAndSaveImage(article.imageUrl, article.xmlId, supabaseClient)
          } catch (imageError: unknown) {
            console.warn(`⚠️ Image download failed for ${article.xmlId}: ${imageError instanceof Error ? imageError.message : String(imageError)}`)
          }
        }

        // Get primary language content for categorization (prefer 'el', fallback to 'en')
        const primaryLang = article.languages['el'] || article.languages['en'] || Object.values(article.languages)[0]
        if (!primaryLang) {
          continue
        }

        // Determine if article is news or insights based on title matching
        const isNewsArticle = isNewsType(primaryLang.title)
        const finalTargetTable = isNewsArticle ? 'news_items' : 'insights'
        const finalTranslationTable = isNewsArticle ? 'news_item_translations' : 'insights_translations'
        const baseSlug = generateSlug(primaryLang.title)
        const uniqueSlug = await generateUniqueSlug(supabaseClient, finalTargetTable, baseSlug)

        // Insert main record
        const mainRecord: any = {
          slug: uniqueSlug,
          published_date: article.publishedDate,
          language_code: 'en', // Default language code
          author: 'Advisable Team'
        }

        if (finalTargetTable === 'insights') {
          mainRecord.category = 'insights'
          mainRecord.type = 'article'
          mainRecord.featured_image = savedImagePath
        } else {
          mainRecord.type = 'article'
          mainRecord.featured_image = savedImagePath
        }

        const { data: insertedRecord, error: insertError } = await supabaseClient
          .from(finalTargetTable)
          .insert(mainRecord)
          .select('id')
          .single()

        if (insertError) {
          console.error(`❌ Failed to insert main record: ${insertError.message}`)
          errorCount++
          continue
        }

        for (const [langCode, content] of Object.entries(article.languages)) {
          const languageId = langCode === 'el' ? languageMap.get('el') : 
                           langCode === 'en' ? languageMap.get('en') : 
                           defaultLanguageId

          if (!languageId) {
            continue
          }

          // Check if translation already exists
          const foreignKeyField = finalTargetTable === 'insights' ? 'insights_id' : 'news_item_id'
          const { data: existingTranslation } = await supabaseClient
            .from(finalTranslationTable)
            .select('id')
            .eq(foreignKeyField, insertedRecord.id)
            .eq('language_id', languageId)
            .limit(1)

          if (existingTranslation && existingTranslation.length > 0) {
            const { error: updateError } = await supabaseClient
              .from(finalTranslationTable)
              .update({
                title: content.title,
                excerpt: content.excerpt,
                content: content.content
              })
              .eq('id', existingTranslation[0].id)

            if (updateError) {
              console.error(`❌ Failed to update translation for ${langCode}: ${updateError.message}`)
            }
          } else {
            // Insert new translation
            const translationRecord: any = {
              language_id: languageId,
              title: content.title,
              excerpt: content.excerpt,
              content: content.content
            }

            if (finalTargetTable === 'insights') {
              translationRecord.insights_id = insertedRecord.id
            } else {
              translationRecord.news_item_id = insertedRecord.id
            }

            const { error: translationError } = await supabaseClient
              .from(finalTranslationTable)
              .insert(translationRecord)

            if (translationError) {
              console.error(`❌ Failed to insert translation for ${langCode}: ${translationError.message}`)
            }
          }
        }

        processedCount++
        
      } catch (articleError: unknown) {
        console.error(`❌ Error processing article ${article.xmlId}: ${articleError instanceof Error ? articleError.message : String(articleError)}`)
        errorCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'XML blog migration completed successfully',
        stats: {
          totalArticles: articles.length,
          processed: processedCount,
          errors: errorCount
        }
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
  const itemRegex = /<item>\s*([\s\S]*?)\s*<\/item>/g
  let match
  let itemCount = 0

  while ((match = itemRegex.exec(xmlText)) !== null) {
    itemCount++
    const itemContent = match[1]
    const id = extractValue(itemContent, 'id')
    const img = extractValue(itemContent, 'img')
    const date = extractValue(itemContent, 'date')
    const published = extractValue(itemContent, 'published')

    if (published !== 'Y') {
      continue
    }
    
    // Extract all captions sections
    const captionsContent = extractValue(itemContent, 'captions')
    if (!captionsContent) {
      continue
    }
    
    // More robust language extraction
    const languages: { [key: string]: any } = {}
    
    // Find all language blocks within captions
    const langBlocks = captionsContent.split(/<\/?\w+>/).filter(block => block.trim())
    
    // Alternative approach: split by lang tags
    const langSections = captionsContent.split(/(?=<lang>)/)
    
    for (const section of langSections) {
      if (!section.includes('<lang>')) continue
      
      const lang = extractValue(section, 'lang')?.trim()
      const slug = extractValue(section, 'slug')?.trim()
      const titleMatch = section.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)
      const descMatch = section.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/s)
      const smallDescMatch = section.match(/<smalldescription><!\[CDATA\[(.*?)\]\]><\/smalldescription>/s)
      
      if (lang && titleMatch && descMatch) {
        languages[lang] = {
          slug: slug || '',
          title: cleanTextForTitle(titleMatch[1] || ''),
          content: preserveHTMLContent(descMatch[1] || ''),
          excerpt: cleanTextForExcerpt(smallDescMatch?.[1] || titleMatch[1] || '')
        }
      }
    }
    
    if (Object.keys(languages).length > 0) {
      articles.push({
        xmlId: id,
        imageUrl: img?.trim() || undefined,
        publishedDate: date,
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

function isNewsType(title: string): boolean {
  const newsKeywords = [
    'The eCommerce Masterclass Trilogy by Sherpa Society',
    'The New HOPEgenesis Site is Live!',
    'Participation of Advisable in the e-Commerce Conference',
    'Advisable is a Proud Sponsor of the ePharmacySummit!',
    'The New LifeLikes Site is Live!',
    'Proud Sponsor – 3rd Google Marketing Conference 2020',
    'The New Corporate Website of SYFAK is Live!',
    'Working with a Google Premier Partner: Why Trust Advisable',
    'Bioderma\'s 360° Digital Strategy in Greece is at Advisable',
    'Advisable Welcomes Goodlife Pharmacy',
    'Εcommercen Instant Login & Smart Images',
    'The New Site of Acropolis-pharmacy is Live!',
    'The New Site of Wisdom Stores is Live!',
    'BoxNow & Viva Wallet in E-commerce',
    'The New Site of Easy-pharmacy is Live!',
    'Significant Award: E-volution Award for wecare.gr',
    'Advisable Welcomes Bioderma Cyprus',
    'Real Pharmacy\'s New Site is Live!'
  ]
  
  // Check for exact matches or partial matches with news titles
  return newsKeywords.some(keyword => 
    title.toLowerCase().includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(title.toLowerCase())
  )
}

async function downloadAndSaveImage(imageUrl: string, articleId: string, supabaseClient: any): Promise<string | null> {
  try {

    // Download image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    // Extract file extension from URL or content-type
    let fileExtension = 'jpg'
    const urlParts = imageUrl.split('.')
    const urlExtension = urlParts[urlParts.length - 1]?.toLowerCase()
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
    const filename = `blog-${articleId}-${Date.now()}.${fileExtension}`
    const filePath = `blog-images/${filename}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(filePath, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false
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