import express = require('express');
const closetItemRouter = express.Router();

const closetItem_controller = require('../controllers/closetItem');

closetItemRouter.get('/:id', closetItem_controller.get);
closetItemRouter.get('/:username', closetItem_controller.getByUser);
closetItemRouter.get('/:universityId', closetItem_controller.getByUniversity);

closetItemRouter.post('/', closetItem_controller.post);

closetItemRouter.put('/', closetItem_controller.post);

closetItemRouter.delete('/:id', closetItem_controller.delete);

module.exports = closetItemRouter;