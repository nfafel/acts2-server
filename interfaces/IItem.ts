import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IItem {
    username: string,
    universityId: typeof ObjectId,
    images: Buffer[],
    description: string,
    size: string,
    brand: string,
    approximateValue: number,
    visibility: string,
    createdAt: string
}