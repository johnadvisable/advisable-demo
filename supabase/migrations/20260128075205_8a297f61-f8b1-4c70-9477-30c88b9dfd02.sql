-- Move Giota and Diamianos before Theodorou (currently at position 15)
-- New order: Giota (13), Diamianos (14), Theodorou (15), then rest shifts

-- Step 1: Shift Theodorou and everyone from 15 onwards up by 2
UPDATE team_members SET display_order = display_order + 2 
WHERE display_order >= 15 AND display_order <= 32;

-- Step 2: Set Giota to position 13
UPDATE team_members SET display_order = 13 WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Step 3: Set Diamianos to position 14
UPDATE team_members SET display_order = 14 WHERE id = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';