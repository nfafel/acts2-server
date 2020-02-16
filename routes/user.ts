import express = require('express');
const userRouter = express.Router();

const user_controller = require('../controllers/user');

userRouter.get('/:username/availability', user_controller.checkAvailability);

userRouter.post('/', user_controller.createUser);

userRouter.post('/login', user_controller.loginUser);

userRouter.delete('/', user_controller.delete);

module.exports = userRouter; 