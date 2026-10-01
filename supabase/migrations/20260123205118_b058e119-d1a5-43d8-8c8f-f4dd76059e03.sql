-- Delete team member translations first (foreign key constraint)
DELETE FROM team_member_translations WHERE team_member_id = '6ebd7da4-7338-42bc-ae1b-80ae7064006f';

-- Delete the team member
DELETE FROM team_members WHERE id = '6ebd7da4-7338-42bc-ae1b-80ae7064006f';