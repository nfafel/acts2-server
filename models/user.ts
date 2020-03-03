import mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
import { IUser } from '../interfaces/IUser';

let UserSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    universityId: {
        type: ObjectId,
        required: true
    },
    profilePicture: {
        type: Buffer, 
        required: false
    },
    secret: {
        type: String,
        required: true
    }
});

// Export the model
module.exports = mongoose.model<IUser>('User', UserSchema);