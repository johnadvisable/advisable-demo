-- Update the companies metric value to reflect 150+ clients
UPDATE metrics SET value = 150 WHERE key = 'companies';

-- Update metric translations to reflect "over 4 countries" instead of listing specific countries
UPDATE metric_translations 
SET description = 'Clients across over 4 countries' 
WHERE metric_id = (SELECT id FROM metrics WHERE key = 'companies');