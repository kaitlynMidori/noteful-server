const FoldersService = {
    getAllFolders(knex) {
        return knex
        .select('*')
        .from('folders')
    },
    getById(knex) {
        return knex
        .from('folders')
        .where( {id} )
        .first()
    },
    addFolder(knex, newFolder) {
        return knex
        .insert(newFolder)
        .into('folders')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    deleteFolder(knex, id) {
        return knex
        .from('folders')
        .where({ id })
        .delete()
    },
    updateFolder(knex, id, newFolderFields) {
        return knex
        .from('folders')
        .where({ id })
        .update(newFolderFields)
    }
}

module.exports = FoldersService;