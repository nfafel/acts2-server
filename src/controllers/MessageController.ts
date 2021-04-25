import Controller from '../lib/Controller';
import { Message } from '../models/Message';
import { INewMessageData } from '../interfaces';

export class MessageController extends Controller {
    public async getMany(req, res) {
        const chatId = req.query.chatId;

        if (!chatId) {
            res.status(400).send({
                code: 400,
                message: '`Chat Id` is a required field',
            });
            return;
        }

        const messages = await Message.find({chatId: chatId});
        res.status(200).send(messages);
    }

    public async post(req, res) {
        const {chatId, userId, text} = req.body;

        if (!chatId || !userId || !text) {
            res.status(400).send({
                code: 400,
                message: '`Chat Id`, `User Id`, and `text` are required fields.'
            });
            return;
        }

        const messageData: INewMessageData = {
            chatId,
            userId,
            text,
            sentAt: new Date(),
        };

        const newMessage = await new Message(messageData).save();
        res.status(201).send(newMessage);
    }

    public async put(req, res) {
        const messageId = req.params.id;
        const newText = req.body.text;
        const updatedMessage = await Message.findOneAndUpdate({id: messageId}, {text: newText}, {runValidators: true, new: true });

        if (!updatedMessage) {
            res.status(400).send({
                code: 404,
                message: 'Message not found',
            });
        }

        res.status(200).send(updatedMessage);
    }

    public async delete(req, res) {
        const messageId = req.params.id;
        const deletedMessage = await Message.findOneAndRemove({id: messageId});

        if (!deletedMessage) {
            res.status(400).send({
                code: 404,
                message: 'Message not found',
            });
        }

        res.status(200).send(deletedMessage.id);
    }

    protected initializeRoutes(): void {
        this.router.get('/', this.getMany);

        this.router.post('/', this.post);

        this.router.put('/:id', this.post);

        this.router.delete('/:id', this.delete);
    }
}