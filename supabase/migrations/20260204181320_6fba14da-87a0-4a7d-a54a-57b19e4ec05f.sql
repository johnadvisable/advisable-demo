-- Rename Market Data category to SizeTheMarket  
UPDATE client_categories 
SET category = 'SizeTheMarket'
WHERE category = 'Market Data';