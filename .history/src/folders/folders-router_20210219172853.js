const express = require('express');
const xss = require('xss');
const path = require('path');
const FoldersService = require('./folders-service');
// const { logger } = require('winston');

const foldersRouter = express.Router();
const bodyParser = express.json();

const sanitizeFolder = folder => ({
    id: folder.id,
    folder_name: xss(folder.folder_name)
});

foldersRouter
    .route('/')
    .get((req,res,next) => {
        FoldersService.getAllFolders(req.app.get('db'))
            .then(folders => {
                return res.json(folders.map(sanitizeFolder))
            })
            .catch(next)
    })
    .post(bodyParser, (req,res,next) => {
        const { folder_name } = req.body;

        if(!folder_name) {
            return res.status(400).json({
                error: { message: `Missing folder name in request body`}
            })
        }

        let newFolder = {
            folder_name: xss(folder_name)
        }

        FoldersService.addFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                .json(folder)
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    .all((req,res,next) => {
        const { folder_id } = req.params
        FoldersService.getById(req.app.get('db'), folder_id)
            .then(folder => {
                if(!folder) {
                    // logger.error(`Folder with id ${folder_id} not found`)
                    return res.status(404).json({
                        error: {message: `Folder not found`}
                    })
                }
                res.folder = folder
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeFolder(res.folder))
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
        .then( () => {
            return res.status(204).end()
        })
        .catch(next)
    })
    .patch(bodyParser, (req,res,next) => {
        // return res.status(204).end()
        const { folder_name } = req.body
        const folderToUpdate = { folder_name }

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
        .then(numRowsAffected => {
            return res.status(204).end()
        })
        .catch(next)
    })

module.exports = foldersRouter;