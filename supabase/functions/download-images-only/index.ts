import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageData {
  xmlId: string
  imageUrl: string
  title: string
  targetTable: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sourceUrl } = await req.json()
    
    if (!sourceUrl) {
      throw new Error('Missing required parameter: sourceUrl')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const xmlResponse = await fetch(sourceUrl)
    if (!xmlResponse.ok) {
      throw new Error(`Failed to fetch XML: ${xmlResponse.status} ${xmlResponse.statusText}`)
    }
    const xmlText = await xmlResponse.text()
    const imageData = extractImagesFromXML(xmlText)

    let downloadedCount = 0
    let errorCount = 0
    let updatedCount = 0

    // Get existing articles from both tables
    const { data: insights } = await supabaseClient
      .from('insights')
      .select('id, slug, featured_image')

    const { data: news } = await supabaseClient
      .from('news')
      .select('id, slug, featured_image')

    const allArticles = [
      ...(insights || []).map(item => ({ ...item, table: 'insights' })),
      ...(news || []).map(item => ({ ...item, table: 'news' }))
    ]

    // Process each image
    for (const imageInfo of imageData) {
      try {
        // Find matching article in database
        const matchingArticle = allArticles.find(article => 
          article.slug.includes(imageInfo.xmlId) || 
          article.slug.includes(generateSlug(imageInfo.title))
        )

        if (!matchingArticle) {
          continue
        }

        // Skip if image already exists
        if (matchingArticle.featured_image) {
          continue
        }

        // Download and save image
        const savedImagePath = await downloadAndSaveImage(
          imageInfo.imageUrl, 
          imageInfo.xmlId, 
          supabaseClient
        )

        if (savedImagePath) {
          // Update the article with the new image
          const { error: updateError } = await supabaseClient
            .from(matchingArticle.table)
            .update({ featured_image: savedImagePath })
            .eq('id', matchingArticle.id)

          if (updateError) {
            console.error(`❌ Failed to update article ${imageInfo.xmlId}:`, updateError.message)
            errorCount++
          } else {
            downloadedCount++
            updatedCount++
          }
        } else {
          errorCount++
        }

      } catch (error: unknown) {
        console.error(`❌ Error processing image for ${imageInfo.xmlId}:`, error instanceof Error ? error.message : String(error))
        errorCount++
      }
    }

    const stats = {
      totalImages: imageData.length,
      downloaded: downloadedCount,
      updated: updatedCount,
      errors: errorCount,
      existingArticles: allArticles.length
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Image download completed',
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
    console.error('💥 Image download failed:', error instanceof Error ? error.message : String(error))
    
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

function extractImagesFromXML(xmlText: string): ImageData[] {
  const images: ImageData[] = []
  
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
    const published = extractValue(itemContent, 'published')
    
    if (published !== 'Y') {
      continue
    }
    
    if (!img || !img.trim()) {
      continue
    }

    // Get title from first available language
    const captionsContent = extractValue(itemContent, 'captions')
    let title = `Article ${id}`
    
    if (captionsContent) {
      const titleMatch = captionsContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s)
      if (titleMatch && titleMatch[1]) {
        title = cleanText(titleMatch[1])
      }
    }

    images.push({
      xmlId: id,
      imageUrl: img.trim(),
      title: title,
      targetTable: 'insights' // Default, will be determined by matching
    })
    
  }
  
  return images
}

function extractValue(content: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 's')
  const match = content.match(regex)
  return match ? match[1].trim() : ''
}

function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '') // Remove CDATA markers
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
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