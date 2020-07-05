export interface IUser {
    id: string,
    username: string,
    password: string,
    universityId: string,
    profilePicture: Buffer,
    profilePictureContentType: string,
    secret: string,
}