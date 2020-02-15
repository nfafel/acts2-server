import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IUser {
    userName: String,   //This is the unique identifier of the user
    password: String, 
    universityId: typeof ObjectId, 
}