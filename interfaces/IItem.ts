import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IItem {
    username: string,
    universityId: typeof ObjectId
    
}