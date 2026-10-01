-- Disable Instagram sync cron jobs until token is renewed

-- Remove the hourly sync job
SELECT cron.unschedule('auto-sync-instagram-feed');

-- Remove the daily sync job  
SELECT cron.unschedule('instagram-sync-daily');