import Controller from '../lib/Controller';
import { Exchange } from '../models';
import { INewExchangeData } from '../interfaces';

export class ExchangeController extends Controller {
    public async getOne(req, res) {
        const exchangeId = req.params.id;
        const exchange = await Exchange.find({id: exchangeId});
        res.status(200).send(exchange);
    }

    // Exchanges in which the owner of the item is the given user
    public async getOwnedByuser(req, res) {
        const userId = req.params.user_id;
        const exchanges = await Exchange.find({ownerUserId: userId});
        res.status(200).send(exchanges);
    }

    // Exchanges in which the offer was made by the given user for item owned by other student
    public async getRequestedByuser(req, res) {
        const userId = req.params.user_id;
        const exchanges = await Exchange.find({requesterUserId: userId});
        res.status(200).send(exchanges);
    }

    public async getByUser(req, res) {
        const userId = req.params.user_id;
        const exchanges = await Exchange.find({
            $or: [
                { ownerUserId: userId },
                { requesterUserId: userId },
            ],
        });
        res.status(200).send(exchanges);
    }

    public async post(req, res) {
        const exchangeData: INewExchangeData = {
            ownerUserId: req.body.ownerUserId,
            requesterUserId: req.body.requesterUserId,
            itemId: req.body.itemId,
            offeredItemId: req.body.offeredItemId,
            offeredDollars: req.body.offeredDollars,
        };
        const newChat = await new Exchange(exchangeData).save();

        res.status(201).send(newChat);
    }

    public async delete(req, res) {
        const exchangeId = req.params.id;
        const deletedExchange = await Exchange.findOneAndRemove({id: exchangeId});

        if (!deletedExchange) {
            res.status(404).send({
                code: 404,
                message: 'Exchange not found',
            });
        }

        res.status(200).send(deletedExchange.id);
    }

    protected initializeRoutes(): void {
        this.router.get('/:id', this.getOne);
        this.router.get('/:user_id/user', this.getByUser);
        this.router.get('/:user_id/owned', this.getByUser);
        this.router.get('/:user_id/requested', this.getByUser);

        this.router.post('/', this.post);

        this.router.delete('/:id', this.delete);
    }
}