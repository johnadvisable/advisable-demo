-- Move Teo Theodorou before Zoi Samioti (position 15)
-- Move Andreas Mprikos after Zoi Samioti (position 17)
-- Final order: Theodorou (15), Samioti (16), Mprikos (17)

-- Step 1: Shift Zoi Samioti and those between her and Theodorou up by 1 (positions 15-17)
UPDATE team_members SET display_order = display_order + 1 
WHERE display_order >= 15 AND display_order <= 17;

-- Step 2: Set Teo Theodorou to position 15
UPDATE team_members SET display_order = 15 WHERE id = '13c12e8c-f4db-4d0f-a736-6487ab1a9a59';

-- Step 3: Set Andreas Mprikos to position 17 (after Zoi who is now at 16)
UPDATE team_members SET display_order = 17 WHERE id = 'ecae29c5-ad3c-4dad-bf37-22f9d6a3c9d8';