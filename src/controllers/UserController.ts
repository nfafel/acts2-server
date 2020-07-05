import { IUser } from "../interfaces/IUser";

import jwt from 'jsonwebtoken';
import randomWords from 'random-words';

import { User } from '../models';
import Controller from '../lib/Controller';

export class UserController extends Controller {
    public async createUser(req, res) {
        console.log("hello from suer controller");
        try {
            var newUser = new User({
                ...req.body,
                secret: randomWords()
            });
            await newUser.save();

            const payload = {
                username: newUser.username,
                universityId: newUser.universityId
            }
            var token = jwt.sign({
                payload: payload
            }, newUser.secret, { expiresIn: '12h' });
            res.send({token: token});

        } catch(err) {
            console.log(err);
            res.status(400).send({message: "Error creating user"});
        }
    }

    public async loginUser(req, res) {
        const username: string = req.body.username;
        const enteredPassword: string = req.body.password;
        
        try {
            const user: IUser = await User.findOne({username: username});
            if (user === null) {
                res.status(403).send({message: "username"})
            } else if (user.password !== enteredPassword) {
                res.status(403).send({message: "password"})
            } else {
                const payload = {
                    username: user.username,
                    universityId: user.universityId
                }
                var token = jwt.sign({
                    payload: payload
                }, user.secret, { expiresIn: '12h' });
                res.send({token: token})
            }
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error Logging in user"})
        }
    }

    public async checkAvailability(req, res) {
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
        this.router.get('/:username/availability', this.checkAvailability);
        this.router.get('/:username', this.getUser);

        this.router.post('/login', this.loginUser);
        this.router.post('/', this.createUser);

        this.router.put('/:username', this.updateUser);

        this.router.delete('/', this.delete);

    }
}
