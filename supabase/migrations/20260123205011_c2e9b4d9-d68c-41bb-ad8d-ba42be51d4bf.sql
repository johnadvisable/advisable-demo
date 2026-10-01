-- Delete team member translations first (foreign key constraint)
DELETE FROM team_member_translations WHERE team_member_id = 'ec07836e-2a4a-4901-bb35-9ea6e14316c2';

-- Delete the team member
DELETE FROM team_members WHERE id = 'ec07836e-2a4a-4901-bb35-9ea6e14316c2';