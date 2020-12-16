ALTER TABLE IF EXISTS notes
    DROP COLUMN folder_id;

truncate notes;
truncate folders;