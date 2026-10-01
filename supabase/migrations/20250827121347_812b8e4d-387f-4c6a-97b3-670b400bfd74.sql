-- Clean up and update client categories based on provided JSON mapping

-- First, let's clean up duplicate clients by merging them
-- We'll keep the first occurrence and update references

-- Step 1: Create a temporary table to map old names to standardized names
CREATE TEMP TABLE client_name_mapping AS
WITH standardized_names AS (
  SELECT DISTINCT
    id,
    name,
    -- Standardize the name (first letter uppercase, rest lowercase, trim spaces)
    CASE 
      WHEN LOWER(TRIM(name)) = 'dioptra' THEN 'Dioptra'
      WHEN LOWER(TRIM(name)) = 'dhl express' THEN 'DHL Express'
      WHEN LOWER(TRIM(name)) = 'kteo hellas' THEN 'KTEO Hellas'
      WHEN LOWER(TRIM(name)) = 'profit.com' THEN 'Profit.com'
      WHEN LOWER(TRIM(name)) = 'zoefull' THEN 'Zoefull'
      WHEN LOWER(TRIM(name)) = 'heidebrenner' THEN 'Heidebrenner'
      WHEN LOWER(TRIM(name)) = 'optika liolios' THEN 'Optika Liolios'
      WHEN LOWER(TRIM(name)) = 'nautilus' THEN 'Nautilus'
      WHEN LOWER(TRIM(name)) = 'wecare' THEN 'Wecare'
      WHEN LOWER(TRIM(name)) = 'dr jart' THEN 'Dr Jart'
      WHEN LOWER(TRIM(name)) = 'e dructer' THEN 'E Dructer'
      WHEN LOWER(TRIM(name)) = 'bluestore' THEN 'BlueStore'
      WHEN LOWER(TRIM(name)) = 'pharmacy 295' THEN 'Pharmacy 295'
      WHEN LOWER(TRIM(name)) = 'mylifelikes' THEN 'MyLifeLikes'
      WHEN LOWER(TRIM(name)) = 'pharmacy discount' THEN 'Pharmacy Discount'
      WHEN LOWER(TRIM(name)) = 'lisari.gr' THEN 'Lisari.gr'
      WHEN LOWER(TRIM(name)) = 'smile pharmacy' THEN 'Smile Pharmacy'
      WHEN LOWER(TRIM(name)) = 'iscool' THEN 'Iscool'
      WHEN LOWER(TRIM(name)) = 'orange pharmacy' THEN 'Orange Pharmacy'
      WHEN LOWER(TRIM(name)) = 'labosuisse' THEN 'Labosuisse'
      WHEN LOWER(TRIM(name)) = 'syfak b2b' THEN 'SYFAK B2B'
      WHEN LOWER(TRIM(name)) = 'gea pharmacy' THEN 'Gea Pharmacy'
      WHEN LOWER(TRIM(name)) = 'anatomic line' THEN 'Anatomic Line'
      WHEN LOWER(TRIM(name)) = 'goodlife pharmacy' THEN 'Goodlife Pharmacy'
      WHEN LOWER(TRIM(name)) = 'vitorgan' THEN 'Vitorgan'
      WHEN LOWER(TRIM(name)) = 'gea' THEN 'Gea'
      WHEN LOWER(TRIM(name)) = 'pharm16' THEN 'Pharm16'
      WHEN LOWER(TRIM(name)) = 'cryogel' THEN 'Cryogel'
      WHEN LOWER(TRIM(name)) = 'phavory' THEN 'Phavory'
      WHEN LOWER(TRIM(name)) = 'eden view mykonos' THEN 'Eden View Mykonos'
      WHEN LOWER(TRIM(name)) = 'prime pharmacy' THEN 'Prime Pharmacy'
      WHEN LOWER(TRIM(name)) = 'jewels4u' THEN 'Jewels4u'
      WHEN LOWER(TRIM(name)) = 'doctor''s formulas' THEN 'Doctor''s Formulas'
      WHEN LOWER(TRIM(name)) = 'hi' THEN 'Hi'
      WHEN LOWER(TRIM(name)) = 'wisdom stores' THEN 'Wisdom Stores'
      WHEN LOWER(TRIM(name)) = 'fastpharmacy' THEN 'FastPharmacy'
      WHEN LOWER(TRIM(name)) = 'pharmacy point' THEN 'Pharmacy Point'
      WHEN LOWER(TRIM(name)) = 'now pharmacy' THEN 'Now Pharmacy'
      WHEN LOWER(TRIM(name)) = 'touriki' THEN 'Touriki'
      WHEN LOWER(TRIM(name)) = 'heals pharmacy' THEN 'Heals Pharmacy'
      WHEN LOWER(TRIM(name)) = 'central pharmacy' THEN 'Central Pharmacy'
      WHEN LOWER(TRIM(name)) = 'bioderma' THEN 'Bioderma'
      WHEN LOWER(TRIM(name)) = 'easy pharmacy' THEN 'Easy Pharmacy'
      WHEN LOWER(TRIM(name)) = 'esthederm' THEN 'Esthederm'
      WHEN LOWER(TRIM(name)) = 'pharmado' THEN 'Pharmado'
      WHEN LOWER(TRIM(name)) = 'joy pharmacy' THEN 'Joy Pharmacy'
      WHEN LOWER(TRIM(name)) = 'syfak' THEN 'SYFAK'
      WHEN LOWER(TRIM(name)) = 'xandakas' THEN 'Xandakas'
      WHEN LOWER(TRIM(name)) = 'phactory' THEN 'Phactory'
      WHEN LOWER(TRIM(name)) = 'z-pharm' THEN 'Z-Pharm'
      WHEN LOWER(TRIM(name)) = 'real pharmacy' THEN 'Real Pharmacy'
      WHEN LOWER(TRIM(name)) = 'pentagon group' THEN 'Pentagon Group'
      WHEN LOWER(TRIM(name)) = 'phancy' THEN 'Phancy'
      WHEN LOWER(TRIM(name)) = 'pharmacy shop' THEN 'Pharmacy Shop'
      WHEN LOWER(TRIM(name)) = 'upharm' THEN 'Upharm'
      WHEN LOWER(TRIM(name)) = 'mantalos' THEN 'Mantalos'
      WHEN LOWER(TRIM(name)) = 'museo' THEN 'Museo'
      WHEN LOWER(TRIM(name)) = 'anco yachting' THEN 'Anco Yachting'
      ELSE TRIM(name)
    END as standardized_name,
    ROW_NUMBER() OVER (PARTITION BY LOWER(TRIM(name)) ORDER BY created_at ASC) as rn
  FROM clients
)
SELECT id, name, standardized_name
FROM standardized_names
WHERE rn = 1;

-- Step 2: Update client names to standardized versions
UPDATE clients 
SET name = cnm.standardized_name
FROM client_name_mapping cnm
WHERE clients.id = cnm.id;

-- Step 3: Delete duplicate clients (keep only the first one)
DELETE FROM clients 
WHERE id NOT IN (SELECT id FROM client_name_mapping);

-- Step 4: Clear all existing client categories
DELETE FROM client_categories;

-- Step 5: Insert new category mappings based on JSON

-- Digital Agency Services category
INSERT INTO client_categories (client_id, category)
SELECT c.id, 'Digital Agency Services'
FROM clients c
WHERE c.name IN (
  'Dioptra', 'DHL Express', 'KTEO Hellas', 'Profit.com', 'Zoefull', 'Heidebrenner',
  'Optika Liolios', 'Nautilus', 'Wecare', 'Dr Jart', 'E Dructer', 'BlueStore',
  'Pharmacy 295', 'MyLifeLikes', 'Pharmacy Discount', 'Lisari.gr', 'Smile Pharmacy',
  'Iscool', 'Orange Pharmacy', 'Labosuisse', 'SYFAK B2B', 'Gea Pharmacy',
  'Anatomic Line', 'Goodlife Pharmacy', 'Vitorgan', 'Gea', 'Pharm16', 'Cryogel',
  'Phavory', 'Eden View Mykonos', 'Prime Pharmacy', 'Jewels4u', 'Doctor''s Formulas',
  'Hi', 'Wisdom Stores', 'FastPharmacy', 'Pharmacy Point', 'Now Pharmacy', 'Touriki',
  'Heals Pharmacy', 'Central Pharmacy', 'Bioderma', 'Easy Pharmacy', 'Esthederm',
  'Pharmado', 'Joy Pharmacy', 'SYFAK', 'Xandakas', 'Phactory', 'Z-Pharm',
  'Real Pharmacy', 'Pentagon Group', 'Phancy', 'Pharmacy Shop', 'Upharm', 'Mantalos',
  'Museo', 'Anco Yachting'
);

-- Ecommercen category  
INSERT INTO client_categories (client_id, category)
SELECT c.id, 'Ecommercen'
FROM clients c
WHERE c.name IN (
  'Dioptra', 'DHL Express', 'Heidebrenner', 'Optika Liolios', 'Nautilus', 'Wecare',
  'E Dructer', 'BlueStore', 'Pharmacy 295', 'MyLifeLikes', 'Pharmacy Discount',
  'Lisari.gr', 'Smile Pharmacy', 'Iscool', 'Orange Pharmacy', 'Labosuisse',
  'SYFAK B2B', 'Gea Pharmacy', 'Goodlife Pharmacy', 'Gea', 'Pharm16', 'Phavory',
  'Prime Pharmacy', 'Jewels4u', 'Doctor''s Formulas', 'Hi', 'Wisdom Stores',
  'FastPharmacy', 'Pharmacy Point', 'Now Pharmacy', 'Touriki', 'Heals Pharmacy',
  'Central Pharmacy', 'Easy Pharmacy', 'Pharmado', 'Joy Pharmacy', 'SYFAK',
  'Phactory', 'Z-Pharm', 'Real Pharmacy', 'Phancy', 'Pharmacy Shop', 'Upharm'
);

-- Market Data category
INSERT INTO client_categories (client_id, category)
SELECT c.id, 'Market Data'
FROM clients c
WHERE c.name IN (
  'Wecare', 'Pharmacy Discount', 'Optika Liolios', 'E Dructer', 'Pharm16', 'Smile Pharmacy'
);

-- Advisable AI category  
INSERT INTO client_categories (client_id, category)
SELECT c.id, 'Advisable AI'
FROM clients c
WHERE c.name IN (
  'Wecare', 'Pharmacy Discount', 'Optika Liolios', 'E Dructer', 'Pharm16', 'Smile Pharmacy'
);

-- Note: Esyntagi Cloud ERP and Venture Studio Services have no clients assigned according to the JSON

-- Step 6: Update product_category for clients based on their primary category
-- Set Digital Agency Services as primary for clients that have it
UPDATE clients 
SET product_category = 'Digital Agency Services'
WHERE id IN (
  SELECT DISTINCT cc.client_id 
  FROM client_categories cc 
  WHERE cc.category = 'Digital Agency Services'
);

-- For clients only in Ecommercen, set that as primary
UPDATE clients 
SET product_category = 'Ecommercen'
WHERE id IN (
  SELECT DISTINCT cc.client_id 
  FROM client_categories cc 
  WHERE cc.category = 'Ecommercen'
  AND cc.client_id NOT IN (
    SELECT client_id FROM client_categories WHERE category = 'Digital Agency Services'
  )
);

-- For clients only in Market Data, set that as primary
UPDATE clients 
SET product_category = 'Market Data'
WHERE id IN (
  SELECT DISTINCT cc.client_id 
  FROM client_categories cc 
  WHERE cc.category = 'Market Data'
  AND cc.client_id NOT IN (
    SELECT client_id FROM client_categories WHERE category IN ('Digital Agency Services', 'Ecommercen')
  )
);

-- For clients only in Advisable AI, set that as primary
UPDATE clients 
SET product_category = 'Advisable AI'
WHERE id IN (
  SELECT DISTINCT cc.client_id 
  FROM client_categories cc 
  WHERE cc.category = 'Advisable AI'
  AND cc.client_id NOT IN (
    SELECT client_id FROM client_categories WHERE category IN ('Digital Agency Services', 'Ecommercen', 'Market Data')
  )
);