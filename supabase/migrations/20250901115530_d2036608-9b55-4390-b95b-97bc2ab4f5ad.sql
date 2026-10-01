-- Add slug field to news_items table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news_items' AND column_name = 'slug') THEN
        ALTER TABLE news_items ADD COLUMN slug text;
        
        -- Add unique constraint on slug
        ALTER TABLE news_items ADD CONSTRAINT news_items_slug_unique UNIQUE (slug);
        
        -- Update existing records with slugs if any exist
        UPDATE news_items 
        SET slug = COALESCE(
            LOWER(REGEXP_REPLACE(
                REGEXP_REPLACE(
                    COALESCE((SELECT title FROM news_item_translations WHERE news_item_id = news_items.id LIMIT 1), ''),
                    '[^a-zA-Z0-9\s-]', '', 'g'
                ),
                '\s+', '-', 'g'
            )),
            'news-item-' || id::text
        )
        WHERE slug IS NULL;
        
        -- Make slug NOT NULL after updating existing records
        ALTER TABLE news_items ALTER COLUMN slug SET NOT NULL;
    END IF;
END $$;