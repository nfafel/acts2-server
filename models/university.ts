import { IUniversity } from '../interfaces/IUniversity';
import mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UniversitySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// Export the model
export const University = mongoose.model<IUniversity>('University', UniversitySchema);