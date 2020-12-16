ALTER TABLE IF EXISTS notes
    DROP COLUMN folder_id;

truncate notes;
truncate folders;
alter table notes 

add column folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE ON UPDATE cascade;

INSERT INTO folders (id, folder_name)
VALUES
    (1, 'first folder'),
    (2, 'second folder'),
    (3, 'third folder');

INSERT INTO notes (id, note_name, content, folder_id)
VALUES
    (1, 'first note', 'some content', 1),
    (2, 'second note', 'some content', 2),
    (3, 'third note', 'some content', 3);