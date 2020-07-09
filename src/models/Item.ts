import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IItem } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'cl_';

export interface IItemDocument extends IItem, Document{
    id: string;
};

const getDefaultId = (): string => {
    return `${schemaPrefix}${cuid()}`;
}

let ItemSchema = new Schema({
    id: {
        type: String, 
        unique: true,
        default: getDefaultId
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
    images: {
        type: [
            {
                key: {
                    required: true,
                    type: String,
                },
                url: {
                    required: true,
                    type: String,
                }
            }
        ], 
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
        required: false,
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
export const Item = mongoose.model<IItemDocument>('Item', ItemSchema);