import {IClosetItem} from './IClosetItem';
import {IImage} from './IImage';

export interface IClosetItemWImage {
    closetItem: IClosetItem,
    images: {base64: string}[]
}