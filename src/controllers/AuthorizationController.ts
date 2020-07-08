import { IUser } from "../interfaces/IUser";

import jwt from 'jsonwebtoken';

import { User } from '../models';
import Controller from '../lib/Controller';

export class AuthorizationController extends Controller {

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
                res.status(200).send({token: token})
            }
        } catch(err) {
            console.log(err)
            res.status(400).send({message: "Error Logging in user"})
        }
    }

    protected initializeRoutes(): void {
        this.router.post('/', this.loginUser);
    }
}
