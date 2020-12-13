const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const { expect } = require('chai')
const {makeNotesArray} = require('./notes.fixtures')

describe.only(`Notes endpoints`, () => {
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

        .raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE')
    })

    afterEach(`clean table`, () => {
        return db
            .raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE')
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
            console.log(testNotes)
            
            beforeEach('insert notes', () => {
                return db                    
                    .into('notes')
                    .insert(testNotes)
            })
            
            it(`responds wtih 200 and the expected notes`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(200, testNotes)
            })
        })
    })
})