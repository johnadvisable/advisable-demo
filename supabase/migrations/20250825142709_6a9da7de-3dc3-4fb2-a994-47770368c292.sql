-- Move extensions to dedicated schema for better security
DROP EXTENSION IF EXISTS pg_cron CASCADE;
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Create dedicated schema for cron extensions
CREATE SCHEMA IF NOT EXISTS cron_extensions;

-- Install extensions in dedicated schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA cron_extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA cron_extensions;

-- Recreate the cron job with proper schema reference
SELECT cron_extensions.cron.schedule(
  'auto-sync-instagram-feed',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    cron_extensions.net.http_post(
        url:='https://difvvdmelbtjxxvpjuvw.supabase.co/functions/v1/sync-instagram-feed',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZnZ2ZG1lbGJ0anh4dnBqdXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mjk3OTEsImV4cCI6MjA1OTIwNTc5MX0.S6W1tGt-ZCW_Vd3H-rz7uaCfjW_WpYJxk9f4d-z-Ojg"}'::jsonb,
        body:='{"source": "auto-cron"}'::jsonb
    ) as request_id;
  $$
);