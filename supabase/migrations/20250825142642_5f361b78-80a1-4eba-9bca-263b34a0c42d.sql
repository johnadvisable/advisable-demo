-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that syncs Instagram feed every hour
SELECT cron.schedule(
  'auto-sync-instagram-feed',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://difvvdmelbtjxxvpjuvw.supabase.co/functions/v1/sync-instagram-feed',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZnZ2ZG1lbGJ0anh4dnBqdXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mjk3OTEsImV4cCI6MjA1OTIwNTc5MX0.S6W1tGt-ZCW_Vd3H-rz7uaCfjW_WpYJxk9f4d-z-Ojg"}'::jsonb,
        body:='{"source": "cron"}'::jsonb
    ) as request_id;
  $$
);