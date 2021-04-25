import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IUser } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'us_';

export interface IUserDocument extends IUser, Document{
    id: string;
};

const getDefaultId = (): string => {
    return `${schemaPrefix}${cuid()}`;
}

let UserSchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: getDefaultId,
    },
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
        type: String,
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
export const User = mongoose.model<IUserDocument>('User', UserSchema);