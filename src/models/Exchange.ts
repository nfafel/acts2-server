import mongoose, { Document } from 'mongoose';
import cuid from 'cuid';
import { IExchange } from '../interfaces';
const Schema = mongoose.Schema;

const schemaPrefix = 'ex_';

export interface IExchangeDocument extends IExchange, Document{
    id: string;
};

const getDefaultId = (): string => {
    return `${schemaPrefix}${cuid()}`;
}

let ExchangeSchema = new Schema({
    id: {
        type: String, 
        unique: true,
        default: getDefaultId
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
export const Exchange = mongoose.model<IExchangeDocument>('Exchange', ExchangeSchema);