const express = require('express');
const xss = require('xss');
const path = require('path');
const NotesServrice = require('./notes-service');

const notesRouter = express.Router();
const bodyParser = express.json();

const sanitizeNote = note => ({
    id: note.id,
    note_name: xss(note.note_name),
    content: xss(note.content),
    folder_id: note.folder_id
});

notesRouter
    .route('/')
    .get((req,res,next) => {

    })
    .post(bodyParser, (req,res,next) => {
        
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

    })
    .patch(bodyParser, (req,res,next) => {
        
    })
    .delete((req,res,next) => {
        
    })

module.exports = notesRouter;

