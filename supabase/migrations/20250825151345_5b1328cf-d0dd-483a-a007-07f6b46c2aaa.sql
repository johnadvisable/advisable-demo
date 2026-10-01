-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to sync Instagram feed every night at 12:00 AM Greek time (22:00 UTC)
SELECT cron.schedule(
  'instagram-sync-daily',
  '0 22 * * *', -- Every day at 22:00 UTC (12:00 AM Greek time)
  $$
  SELECT
    net.http_post(
        url:='https://difvvdmelbtjxxvpjuvw.supabase.co/functions/v1/sync-instagram-feed',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZnZ2ZG1lbGJ0anh4dnBqdXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mjk3OTEsImV4cCI6MjA1OTIwNTc5MX0.S6W1tGt-ZCW_Vd3H-rz7uaCfjW_WpYJxk9f4d-z-Ojg"}'::jsonb,
        body:='{"scheduled": true, "time": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);