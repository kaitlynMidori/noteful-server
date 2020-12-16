    ALTER TABLE IF EXISTS notes
        DROP COLUMN folder_id;

    DROP TABLE IF EXISTS notes;
   	DROP TABLE IF EXISTS folders;

    CREATE TABLE notes (
        id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
        note_name TEXT NOT NULL,
        content TEXT NOT NULL,
        modified DATE DEFAULT now()
    );
    
   create table folders (
	  	id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	    folder_name TEXT NOT NULL
   );
  
  alter table notes 
  	add column folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE ON UPDATE cascade;
   
  