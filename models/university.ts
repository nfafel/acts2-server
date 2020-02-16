import mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UniversitySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Export the model
module.exports = mongoose.model('University', UniversitySchema);