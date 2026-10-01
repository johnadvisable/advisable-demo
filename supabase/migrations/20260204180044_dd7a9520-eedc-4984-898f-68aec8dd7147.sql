-- Update Pixaera category from "Digital Agency" to "Digital Agency Services"
UPDATE client_categories 
SET category = 'Digital Agency Services'
WHERE client_id = '34f3debd-53d3-4977-ad98-9980aba91255' AND category = 'Digital Agency';