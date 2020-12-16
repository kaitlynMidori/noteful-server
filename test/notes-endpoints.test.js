const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { expect } = require('chai')
const {makeNotesArray} = require('./notes.fixtures')
const { makeFoldersArray } = require('./folders.fixtures')
const faker = require('faker')
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

    before(`clean table`, () => {
        return db
            .raw(`truncate notes, folders RESTART IDENTITY CASCADE;`)
    })


    afterEach(`clean table`, () => {
        return db
            .raw(`truncate notes, folders RESTART IDENTITY CASCADE;`)
      
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
           
            
            it(`responds wtih 200`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(200)
            })
        })
    })

    describe('POST /api/notes', () => {

        
        const testFolders = makeFoldersArray()

        beforeEach(`insert folders`, () => {
            return db
                .into('folders')
                .insert(testFolders)
        })

        afterEach(`clean table`, () => {
            return db
                .raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE')
        })

        it(`responds with 201 when note is added
        and returns new note with id`, () => { 

            const newNote = {
                    note_name: faker.lorem.words(),
                    content: faker.lorem.paragraphs(1),
                    folder_id: 2,
            }

            return supertest(app)
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                   .expect(res => {
                       expect(res.body.note_name).to.eql(newNote.note_name)
                       expect(res.body.content).to.eql(newNote.content)
                       expect(res.body.folder_id).to.eql(newNote.folder_id)
                       expect(res.body).to.have.property('id')
                       expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`)
                   })
                .then(response => {
                    supertest(app)
                        .get(`/api/notes/${response.body.id}`)
                        .expect(response.body)
                })   
        })
    })

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


    describe('PATCH /api/notes/:id', () => {
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

            it(`responds with 204 and updates the note`, () => {
                const idToUpdate = 2;
                const updatedNote = {                
                    note_name: faker.lorem.words(),
                    content: faker.lorem.paragraphs(1),
                    folder_id: 3,
                };

                

                const expectedNote = {
                    ...testNotes[idToUpdate - 1],
                    ...updatedNote
                }

                return supertest(app)
                    .patch(`/api/notes/${idToUpdate}`)
                    .send(updatedNote)
                    .expect(204)
                    .then( res => {
                        return supertest(app)
                        .get(`/api/notes/${idToUpdate}`)
                        .expect(expectedNote)
                })
            })
        })
    })
    describe('DELETE /api/notes/:id', () => {})
})