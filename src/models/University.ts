import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IUniversity } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'un_';

export interface IUniversityDocument extends IUniversity, Document{
    id: string;
};

let UniversitySchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: `${schemaPrefix}${cuid()}`,
    },
    name: {
        type: String,
        required: true,
    }
});

// Export the model
export const University = mongoose.model<IUniversityDocument>('University', UniversitySchema);