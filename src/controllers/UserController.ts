import { IUser } from "../interfaces/IUser";

import randomWords from 'random-words';

import { User } from '../models';
import Controller from '../lib/Controller';

export class UserController extends Controller {
    public async createUser(req, res) {
        try {
            const newUser = await new User({
                ...req.body,
                secret: randomWords()
            }).save();

            res.status(201).send(newUser);
        } catch(err) {
            console.log(err);
            res.status(400).send({message: "Error creating user"});
        }
    }

    public async checkUsernameAvailability(req, res) {
        try {
            const user: IUser = await User.findOne({username: req.params.username});
            if (user === null) {
                res.send({available: true})
            } else {
                res.send({available: false})
            }
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error checking username availability"})
        }
    }

    public async getUser(req, res) {
        try {
            const user: IUser = await User.findOne({id: req.params.id});
            res.status(200).send(user);

        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error getting user"})
        }
    }

    public async updateUser(req, res) {
        try {
            const userUpdates = req.body.updates;
            const updatedUser: IUser = await User.findOneAndUpdate({id: req.params.id}, userUpdates, {runValidators: true, new: true });
            res.status(200).send(updatedUser);
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error getting user"})
        }
    }

    public async delete(req, res) { //Verify JWT for this route
        try {
            await User.findOneAndRemove({id: req.params.id});
            //Delete their items and posts here
            res.status(200).send(req.params)
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error deleting user"})
        }
    }

    protected initializeRoutes(): void {
        this.router.get('/:username/availability', this.checkUsernameAvailability);
        this.router.get('/:id', this.getUser);

        this.router.post('/', this.createUser);

        this.router.put('/:id', this.updateUser);

        this.router.delete('/:id', this.delete);

    }
}
