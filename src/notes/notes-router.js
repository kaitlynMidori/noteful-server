const express = require('express');
const xss = require('xss');
const path = require('path');
const NotesServrice = require('./notes-service');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const bodyParser = express.json();

const sanitizeNote = note => ({
    id: note.id,
    note_name: xss(note.note_name),
    content: xss(note.content),
    folder_id: note.folder_id,
    modified: note.modified
});

notesRouter
    .route('/')
    .get((req,res,next) => {
        NotesService.getAllNotes(req.app.get('db'))
            .then(notes => {
                return res.json(notes.map(sanitizeNote))
            })
            .catch(next)
    })
    .post(bodyParser, (req,res,next) => {
        // return res.send(201)
        const { note_name, content, folder_id, modified  } = req.body;
        let reqNoteKeys = { 
            note_name: note_name,
            content: content,
            folder_id: folder_id
        };
        
        let optionalNoteKeys = { modified: modified };
        
        
        for (const [key, value] of Object.entries(reqNoteKeys)) {
            if(value == null) {
                return res.status(400).json({
                error: { message: `Missing ${key} in request body` }
                });
            }
        }

        let newNote = {
            ...reqNoteKeys,
            ...optionalNoteKeys
        };


        NotesService.addNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            return res
                .status(201)
                .location(path.posix.join (req.originalUrl, `/${note.id}`))
                .json(sanitizeNote(note));
        })
        .catch(next)
        
    })

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        const { note_id } = req.params;
        NotesServrice.getById(req.app.get('db'), note_id)
            .then(note => {
                if(!note){
                    return res.status(404).json({
                        error: { message: `Note not found`}
                    })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req,res,next) => {
        res.json(sanitizeNote(res.note))
    })
    .patch(bodyParser, (req,res,next) => {
        
    })
    .delete((req,res,next) => {
        
    })

module.exports = notesRouter;

