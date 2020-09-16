import Controller from '../lib/Controller';
import { Chat, Message } from '../models';
import { INewChatData } from '../interfaces/INewChatData';

export class ChatController extends Controller {
    public async getByUser(req, res) {
        const userId = req.query.userId;

        if (!userId) {
            res.status(400).send({
                code: 400,
                message: '`User Id` is required',
            });
            return;
        }

        const chats = await Chat.find({
            $or: [
                { firstUserId: userId },
                { secondUserId: userId },
            ],
        });
        res.status(200).send(chats);
    }

    public async post(req, res) {
        const chatData: INewChatData = {
            firstUserId: req.body.firstUserId,
            secondUserId: req.body.secondUserId,
            exchangeId: req.body.exchangeId,
            startedAt: new Date(),
        };
        const newChat = await new Chat(chatData).save();

        res.status(201).send(newChat);
    }

    public async delete(req, res) {
        const chatId = req.params.id;
        const deletedChat = await Chat.findOneAndRemove({id: chatId});

        if (!deletedChat) {
            res.status(404).send({
                code: 404,
                message: 'Chat not found',
            });
        }

        await Message.deleteMany({chatId: chatId})
        res.status(200).send(deletedChat.id);
    }

    protected initializeRoutes(): void {
        this.router.get('/user', this.getByUser);

        this.router.post('/', this.post);

        this.router.delete('/:id', this.delete);
    }
}