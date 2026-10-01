-- Move Ilias Galiotos (display_order 24) to position 9 (after Vasilis Panagopoulos at position 8)
-- First, shift everyone from position 9-23 up by 1
UPDATE team_members SET display_order = display_order + 1 
WHERE display_order >= 9 AND display_order < 24;

-- Then set Ilias Galiotos to position 9
UPDATE team_members SET display_order = 9 
WHERE id = '59cc06e7-914e-43de-97ea-cbab03c34ebc';