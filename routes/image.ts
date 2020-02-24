import express = require('express');
const imageRouter = express.Router();

const image_controller = require('../controllers/image');

imageRouter.post('/uploadOne', image_controller.uploadOne);

imageRouter.post('/uploadMany', image_controller.uploadMany);

imageRouter.get('/getOne', image_controller.getOne);

imageRouter.get('/getMany', image_controller.getMany);

imageRouter.post('/bucket', image_controller.createBucket);

module.exports = imageRouter; 