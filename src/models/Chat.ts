import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IChat } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'ch_';

export interface IChatDocument extends IChat, Document{
    id: string;
};

let ChatSchema = new Schema({
    id: {
        type: String, 
        unique: true,
        default: `${schemaPrefix}${cuid()}`
    },
    firstUserId: {
        type: String,
        required: true,
    },
    secondUserId: {
        type: String,
        required: true,
    },
    startedAt: {
        type: Date,
        required: true,
    }
});

// Export the model
export const Chat = mongoose.model<IChatDocument>('Chat', ChatSchema);