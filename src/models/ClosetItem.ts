import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IClosetItem } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'cl_';

export interface IClosetItemDocument extends IClosetItem, Document{
    id: string;
};

let ClosetItemSchema = new Schema({
    id: {
        type: String, 
        unique: true,
        default: `${schemaPrefix}${cuid()}`
    },
    userId: {
        type: String, 
        required: true,
    },
    username: {
        type: String, 
        required: true,
    },
    universityId: {
        type: String,
        required: true
    },
    imageKeys: {
        type: [String], 
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
export const ClosetItem = mongoose.model<IClosetItemDocument>('ClosetItem', ClosetItemSchema);