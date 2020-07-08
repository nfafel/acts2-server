import { IImage } from ".";

export interface IClosetItem {
    id: string,
    userId: string,
    username: string,
    universityId: string,
    images: IImage[],
    createdAt: Date,
    gender: string,
    quality: number,
    brand: string,
    size: string,
    value?: string,
    clothingType: string
}
