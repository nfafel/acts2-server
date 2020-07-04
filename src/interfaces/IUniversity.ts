import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IUniversity {
    _id: typeof ObjectId,
    name: string   
}