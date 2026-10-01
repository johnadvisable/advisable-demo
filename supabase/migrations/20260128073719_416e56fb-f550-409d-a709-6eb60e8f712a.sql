-- Move Vag Papaloukas, George Hatzopoulos, Bill Totskas before Zoi Samioti
-- Zoi is at 12, we need to insert 3 people before her

-- First shift Zoi, Eleni, Diana (positions 12-14) up by 3
UPDATE team_members SET display_order = display_order + 3 
WHERE display_order >= 12 AND display_order <= 14;

-- Now set the three people to positions 12, 13, 14
UPDATE team_members SET display_order = 12 WHERE id = 'e50c9338-579b-4acb-afdc-471f27173cda'; -- Vag Papaloukas
UPDATE team_members SET display_order = 13 WHERE id = '3cdec20e-9e5d-4747-8d35-8d2fa8a601d0'; -- George Hatzopoulos
UPDATE team_members SET display_order = 14 WHERE id = '0ee87a77-fd11-4a6b-bea2-273bd3f40999'; -- Bill Totskas