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
    ownerUserId: {
        type: String,
        required: true,
    },
    requesterUserId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    offeredItemId: {
        type: String,
        required: false,
    },
    offeredDollars: {
        type: Number,
        required: false,
    }
});

// Export the model
export const Exchange = mongoose.model<IExchangeDocument>('Exchange', ExchangeSchema);