const express = require('express');
const xss = require('xss');
const logger = require('..');
const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const bodyParser = express.json();

const serializefolder = folder => ({
    id: bookmark.id,
    folder_name: xss(folder.folder_name)
});

foldersRouter
    .route('/api/folders')
    .get((req,res,next) => {
        FoldersService.getAllFolders(req.app.get('db'))
            .then(folders => {
                return res.json(folders.map(serializefolder))
            })
            .catch(next)
    })