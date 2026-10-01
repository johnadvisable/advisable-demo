-- Rename MarketData category to SizeTheMarket
UPDATE client_categories 
SET category = 'SizeTheMarket'
WHERE category = 'MarketData';