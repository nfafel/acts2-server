import { IUser } from "../interfaces/IUser";

const jwt = require('jsonwebtoken');
const randomWords = require('random-words');

const User = require('../models/user');

exports.createUser = async(req, res) => {
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
        res.send({token: token})

    } catch(err) {
        console.log(err);
        res.status(400).send({message: "Error creating user"});
    }
}

exports.loginUser = async(req, res) => {
    const username: String = req.body.username;
    const enteredPassword: String = req.body.password;
    
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

exports.checkAvailability = async(req, res) => {
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

exports.getUser = async(req, res) => {
    try {
        const user: IUser = await User.findOne({username: req.params.username});
        res.send({user: user});

    } catch(err) {
        console.log(err)
        res.status(400).send({message: "Error getting user"})
    }
}

exports.updateUser = async(req, res) => {
    try {
        const userUpdates = req.body.updates;
        const updatedUser: IUser = await User.findOneAndUpdate({username: req.params.username}, userUpdates, {useFindAndModify: false, runValidators: true, new: true });
        res.send({updatedUser: updatedUser});
    } catch(err) {
        console.log(err)
        res.status(400).send({message: "Error getting user"})
    }
}

exports.delete = async(req, res) => { //Verify JWT for this route
    try {
        await User.deleteOne({username: req.params.username});
        //Delete their items and posts here
        res.send({userRemoved: req.params.number})
    } catch(err) {
        console.log(err)
        res.status(400).send({message: "Error deleting user"})
    }
}