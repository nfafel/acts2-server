import express = require('express');
const userRouter = express.Router();

const user_controller = require('../controllers/user');

userRouter.get('/:username/availability', user_controller.checkAvailability);
userRouter.get('/:username', user_controller.getUser);

userRouter.post('/login', user_controller.loginUser);
userRouter.post('/', user_controller.createUser);

userRouter.put('/:username', user_controller.updateUser);

userRouter.delete('/', user_controller.delete);

module.exports = userRouter; 