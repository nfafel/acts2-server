export interface IUser {
    id: string;
    username: string;
    password: string;
    universityId: string;
    universityName: string;
    profilePicture: Buffer;
    profilePictureContentType: string;
    secret: string;
}
