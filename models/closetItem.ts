import mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
import { IClosetItem } from '../interfaces/IClosetItem';

let ClosetItemSchema = new Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    universityId: {
        type: ObjectId,
        required: true
    },
    images: {
        type: Array, 
        required: true
    },
    gender: {
        type: String, 
        required: true,
    },
    quality: {
        type: Number, 
        required: true,
    },
    brand: {
        type: String, 
        required: true,
    },
    size: {
        type: String, 
        required: true,
    },
    value: {
        type: String, 
        required: true,
    },
    publicity: {
        type: String, 
        required: true,
    },
    clothingType: {
        type: String, 
        required: true,
    },
    createdAt: {
        type: Date, 
        required: true,
    },
});

// Export the model
module.exports = mongoose.model<IClosetItem>('User', ClosetItemSchema);