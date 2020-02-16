import express = require('express');
const universityRouter = express.Router();

const university_controller = require('../controllers/university');

universityRouter.get('/:search', university_controller.getSearchResults);

module.exports = universityRouter; 