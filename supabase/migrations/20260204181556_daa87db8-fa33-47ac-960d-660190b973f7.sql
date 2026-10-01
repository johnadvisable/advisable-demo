-- Update the product_category column in clients table from 'Market Data' to 'SizeTheMarket'
UPDATE clients 
SET product_category = 'SizeTheMarket'
WHERE product_category = 'Market Data';