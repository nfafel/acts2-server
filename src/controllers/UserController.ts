import { IUser } from "../interfaces/IUser";

import randomWords from 'random-words';

import { User } from '../models';
import Controller from '../lib/Controller';

export class UserController extends Controller {
    public async createUser(req, res) {
        try {
            var newUser = new User({
                ...req.body,
                secret: randomWords()
            });
            await newUser.save();

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
            const user: IUser = await User.findOne({username: req.params.username});
            res.send({user: user});

        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error getting user"})
        }
    }

    public async updateUser(req, res) {
        try {
            const userUpdates = req.body.updates;
            const updatedUser: IUser = await User.findOneAndUpdate({username: req.params.username}, userUpdates, {runValidators: true, new: true });
            res.send({updatedUser: updatedUser});
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error getting user"})
        }
    }

    public async delete(req, res) { //Verify JWT for this route
        try {
            await User.deleteOne({username: req.params.username});
            //Delete their items and posts here
            res.send({userRemoved: req.params.number})
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error deleting user"})
        }
    }

    protected initializeRoutes(): void {
        this.router.get('/:username/availability', this.checkUsernameAvailability);
        this.router.get('/:username', this.getUser);

        this.router.post('/', this.createUser);

        this.router.put('/:username', this.updateUser);

        this.router.delete('/', this.delete);

    }
}
