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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for action-based routing
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'cleanup';

    if (action === 'insert_records') {
      const { table, records } = body;
      if (!table || !records || (Array.isArray(records) && records.length === 0)) {
        return new Response(JSON.stringify({ success: false, error: 'Missing table or records' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
        });
      }

      const payload = Array.isArray(records) ? records : [records];
      const { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select();

      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
        });
      }

      return new Response(JSON.stringify({ success: true, inserted: data?.length || 0, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle update_field action
    if (action === 'update_field') {
      const { table, filters, updates } = body;
      if (!table || !filters || !updates) {
        return new Response(JSON.stringify({ success: false, error: 'Missing table, filters, or updates' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
        });
      }

      let query = supabase.from(table).update(updates);
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
      const { error, count } = await query;

      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500
        });
      }

      return new Response(JSON.stringify({ success: true, updated: count, message: `Updated ${table} successfully` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Original cleanup logic
    let totalDeleted = 0;
    
    const { error: blogTransError, count: blogTransCount } = await supabase
      .from('blog_post_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (blogTransError) {
      console.error('❌ Error deleting blog post translations:', blogTransError);
    } else {
      totalDeleted += blogTransCount || 0;
    }
    
    // Delete all blog posts
    const { error: blogError, count: blogCount } = await supabase
      .from('blog_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (blogError) {
      console.error('❌ Error deleting blog posts:', blogError);
    } else {
      totalDeleted += blogCount || 0;
    }
    
    // Delete all news item translations first (foreign key constraint)
    const { error: newsTransError, count: newsTransCount } = await supabase
      .from('news_item_translations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (newsTransError) {
      console.error('❌ Error deleting news item translations:', newsTransError);
    } else {
      totalDeleted += newsTransCount || 0;
    }
    
    // Delete all news items
    const { error: newsError, count: newsCount } = await supabase
      .from('news_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (newsError) {
      console.error('❌ Error deleting news items:', newsError);
    } else {
      totalDeleted += newsCount || 0;
    }
    
    // Delete related redirects (optional - they might be useful)
    const { error: redirectError, count: redirectCount } = await supabase
      .from('redirects')
      .delete()
      .or('new_path.like.%/blog/%, new_path.like.%/news/%');
    
    if (redirectError) {
      console.error('❌ Error deleting redirects:', redirectError);
    } else {
      totalDeleted += redirectCount || 0;
    }
    
    const summary = `Cleanup Summary:
🧹 Total Records Deleted: ${totalDeleted}
📝 Blog Posts: ${blogCount || 0}
📰 News Items: ${newsCount || 0}  
🌐 Blog Translations: ${blogTransCount || 0}
🌐 News Translations: ${newsTransCount || 0}
🔄 Redirects: ${redirectCount || 0}

All existing content has been successfully removed.
Ready for fresh migration.`;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: summary,
        totalDeleted: totalDeleted
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
    
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: `Cleanup failed: ${error.message}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});