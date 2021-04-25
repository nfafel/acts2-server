import { IImage } from ".";

export interface IItem {
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
