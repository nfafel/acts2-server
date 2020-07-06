import {IClosetItem} from './IClosetItem';

export interface IClosetItemWImage {
    closetItem: IClosetItem,
    images: {base64: string}[]
}
