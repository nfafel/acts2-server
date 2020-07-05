import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IMessage } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'me_';

export interface IMessageDocument extends IMessage, Document{
    id: string;
};

let MessageSchema = new Schema({
    id: {
        type: String, 
        unique: true,
        default: `${schemaPrefix}${cuid()}`,
    },
    userId: {
        type: String, 
        required: true,
        unique: true
    },
    username: {
        type: String, 
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    }
});

// Export the model
export const Message = mongoose.model<IMessageDocument>('Message', MessageSchema);