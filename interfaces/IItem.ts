import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IItem {
    userName: String,
    universityId: typeof ObjectId
    
}