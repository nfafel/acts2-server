export interface IExchange {
    id: string;
    ownerUserId: string;
    requesterUserId: string;
    itemId: string;
    offeredItemId?: string;
    offeredDollars?: number;
}
