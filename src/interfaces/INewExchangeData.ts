export interface INewExchangeData {
    ownerUserId: string;
    requesterUserId: string;
    itemId: string;
    offeredItemId?: string;
    offeredDollars?: number;
}
