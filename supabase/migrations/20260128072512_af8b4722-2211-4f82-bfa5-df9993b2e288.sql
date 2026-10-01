-- Move Tina Ioanou (display_order 12) to position 6 (after Yiorgos Blatsis at position 5)
-- First, shift everyone from position 6-11 up by 1
UPDATE team_members SET display_order = display_order + 1 
WHERE display_order >= 6 AND display_order < 12;

-- Then set Tina to position 6
UPDATE team_members SET display_order = 6 
WHERE id = 'be0b76a3-c456-4fae-a7b7-5545e7a410ba';