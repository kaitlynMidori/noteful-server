const knex = require('knex')
const supertest = require('supertest')
const {makeFoldersArray} = require('./folders.fixtures')
const app = require('../src/app')

describe('Folders endpoints', () => {
    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy() )

    before(`clean table`, () => {
        return db
            .raw('TRUNCATE TABLE folders CASCADE')
    })

    afterEach(`clean table`, () => {
        return db
            .raw('TRUNCATE TABLE folders CASCADE')
    })

    describe(`GET /api/folders`, () => {
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, [])
            })
        })

        context(`Given there are folders in the database`, () => {
            const testFolders = makeFoldersArray()

            beforeEach('insert folders', () => {
                return db
                    .insert(testFolders)
                    .into('folders')
            })
            
            it(`responds wtih 200 and the expected bookmarks`, () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, testFolders)
            })
        })
    })
})
