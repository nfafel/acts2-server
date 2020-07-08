import Controller from '../lib/Controller';
import { Chat, Message } from '../models';
import { INewChatData } from '../interfaces/INewChatData';

export class ChatController extends Controller {
    public async getByUser(req, res) {
        const userId = req.params.user_id;
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
            startedAt: new Date(),
        };
        const newChat = await new Chat(chatData).save();
    }

    public async delete(req, res) {
        const chatId = req.params.id;
        const deletedChat = await Chat.findOneAndRemove({id: chatId});
        await Message.deleteMany({chatId: chatId})
        res.status(200).send(deletedChat.id);
    }

    protected initializeRoutes(): void {
        this.router.get('/:user_id', this.getByUser);

        this.router.post('/', this.post);

        this.router.delete('/:id', this.delete);
    }
}