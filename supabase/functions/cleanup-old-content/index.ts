import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get counts before deletion
    const { count: blogCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
      
    const { count: newsCount } = await supabase
      .from('news_items')
      .select('*', { count: 'exact', head: true });

    // Delete all blog post translations first (due to foreign key constraints)
    const { error: blogTransError } = await supabase
      .from('blog_post_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (blogTransError) {
      console.error('Error deleting blog post translations:', blogTransError);
      throw blogTransError;
    }

    // Delete all blog posts
    const { error: blogError } = await supabase
      .from('blog_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (blogError) {
      console.error('Error deleting blog posts:', blogError);
      throw blogError;
    }

    // Delete all news item translations first (due to foreign key constraints)
    const { error: newsTransError } = await supabase
      .from('news_item_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (newsTransError) {
      console.error('Error deleting news item translations:', newsTransError);
      throw newsTransError;
    }

    // Delete all news items
    const { error: newsError } = await supabase
      .from('news_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (newsError) {
      console.error('Error deleting news items:', newsError);
      throw newsError;
    }

    // Also clean up any old redirects that might be pointing to non-existent content
    const { error: redirectError } = await supabase
      .from('redirects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all redirects

    if (redirectError) {
      console.error('Error deleting redirects:', redirectError);
      throw redirectError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted ${blogCount} blog posts and ${newsCount} news items`,
        blogPostsDeleted: blogCount || 0,
        newsItemsDeleted: newsCount || 0,
        redirectsDeleted: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});