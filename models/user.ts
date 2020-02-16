import mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let UserSchema = new Schema({
    username: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    universityId: {
        type: ObjectId,
        required: true
    },
    secret: {
        type: String,
        required: true
    }
});

// Export the model
module.exports = mongoose.model('User', UserSchema);