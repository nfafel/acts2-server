import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IUniversity } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'un_';

export interface IUniversityDocument extends IUniversity, Document{
    id: string;
};

const getDefaultId = (): string => {
    return `${schemaPrefix}${cuid()}`;
}

let UniversitySchema = new Schema({
    id: {
        type: String,
        unique: true,
        default: getDefaultId,
    },
    name: {
        type: String,
        required: true,
    }
});

// Export the model 
export const University = mongoose.model<IUniversityDocument>('University', UniversitySchema);
