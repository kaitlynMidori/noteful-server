INSERT INTO folders (folder_name)
VALUES
    ( 'first folder'),
    ( 'second folder'),
    ( 'third folder');

INSERT INTO notes ( note_name, content, folder_id)
VALUES
    ( 'first note', 'some content', 1),
    ( 'second note', 'some content', 2),
    ( 'third note', 'some content', 3);