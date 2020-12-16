const NotesService = {
    getAllNotes(knex) {
        return knex
        .from('notes')
        .select('*')
    },
    getById(knex, id) {
        return knex
        .from('notes')
        .where( { id } )
        .first()
    },
    addNote(knex, newNote) {
        return knex
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(rows => {
            return rows[0]
        })

    },
    deleteNote(knex, id) {
        return knex
        .from('notes')
        .where({ id })
        .delete()
    },
    updateNote(knex, id, newNoteFileds) {
        return knex
        .from('notes')
        .where({ id })
        .update(newNoteFileds)
    }
}

module.exports = NotesService