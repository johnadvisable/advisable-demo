-- Remove (GR) from Tina Ioannou's Greek name
UPDATE team_member_translations 
SET name = 'Tina Ioanou'
WHERE team_member_id = 'be0b76a3-c456-4fae-a7b7-5545e7a410ba' 
AND language_id = (SELECT id FROM languages WHERE code = 'el');