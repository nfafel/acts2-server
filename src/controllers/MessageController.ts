import Controller from '../lib/Controller';
import { Message } from '../models/Message';
import { INewMessageData } from '../interfaces';

export class MessageController extends Controller {
    public async getAllByChat(req, res) {
        const chatId = req.params.chat_id;
        const messages = await Message.find({chatId: chatId});
        
        res.status(200).send(messages);
    }

    public async post(req, res) {
        const messageData: INewMessageData = {
            chatId: req.body.chatId,
            userId: req.body.userId,
            text: req.body.text,
            sentAt: new Date(),
        };
        const newMessage = await new Message(messageData).save();
        res.status(201).send(newMessage);
    }

    public async put(req, res) {
        const messageId = req.params.id;
        const newText = req.body.text;
        const updatedMessage = await Message.findOneAndUpdate({id: messageId}, {text: newText}, {runValidators: true, new: true });
        res.status(200).send(updatedMessage);
    }

    public async delete(req, res) {
        const messageId = req.params.id;
        const deletedMessage = await Message.findOneAndRemove({id: messageId});
        res.status(200).send(deletedMessage.id);
    }

    protected initializeRoutes(): void {
        this.router.get('/:chat_id', this.getAllByChat);

        this.router.post('/', this.post);

        this.router.put('/:id', this.post);

        this.router.delete('/:id', this.delete);
    }
}