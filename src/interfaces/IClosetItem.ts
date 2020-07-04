import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IClosetItem {
    username: string,
    universityId: typeof ObjectId,
    imageKeys: string[],
    createdAt: Date,
    gender: string,
    quality: number,
    brand: string,
    size: string,
    value?: string,
    publicity: string,
    clothingType: string
}