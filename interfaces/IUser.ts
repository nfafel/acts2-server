import mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface IUser {
    username: string,   //This is the unique identifier of the user
    password: string, 
    universityId: typeof ObjectId, 
    profilePicture: Buffer,
    profilePictureContentType: string,
    secret: string
}