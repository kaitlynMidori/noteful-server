const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { expect } = require('chai')
const {makeNotesArray} = require('./notes.fixtures')
const { makeFoldersArray } = require('./folders.fixtures')
const notesRouter = require('../src/notes/notes-router')

describe(`Notes endpoints`, () => {
    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy() )

    // before(`clean table`, () => {
    //     return db('folders').truncate()
        
    //     .raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE')    
    // })
    before(`clean table`, () => {
        return db
        
        .raw(`           
            truncate notes, folders RESTART IDENTITY CASCADE;
            `)
    })


    afterEach(`clean table`, () => {
        return db
            .raw(`
                truncate notes, folders RESTART IDENTITY CASCADE;
                `)
      
    })
    
    describe(`GET /api/notes`, () => {
        context(`Given no notes`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(200, [])
            })

        })

        context(`Given there are notes in the database`, () => {
            const testNotes = makeNotesArray()
            const testFolders = makeFoldersArray()

            beforeEach(`insert folders`, () => {
                return db
                    .into('folders')
                    .insert(testFolders)
                    .then(() =>
                        {return db.into('notes')
                        .insert(testNotes)}
                    )
            })


            afterEach(`clean table`, () => {
                return db
                    .raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE')
              
            })
            afterEach(`clean table`, () => {
                return db
              
                    .raw('TRUNCATE notes')
            })
            
            it(`responds wtih 200`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(200)
            })
        })
    })

    describe('POST /api/notes', () => {})

    describe('GET /api/notes/:id', () => {
        const testNotes = makeNotesArray()
        const testFolders = makeFoldersArray()
            
        beforeEach(`insert folders`, () => {
            return db
                .into('folders')
                .insert(testFolders)
                .then(() =>
                    {return db.into('notes')
                    .insert(testNotes)}
                )
        })
        
        it(`responds with 200 and the expected note`, function() {
            this.retries(3)
            const noteId = 2
            const expectedNote = testNotes[noteId - 1]
            return supertest(app)
                .get(`/api/notes/${noteId}`)
                .expect(200, expectedNote)
        })
    })


    describe('PATCH /api/notes/:id', () => {})
    describe('DELETE /api/notes/:id', () => {})
})