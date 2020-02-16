import { IUser } from "../interfaces/IUser";

const jwt = require('jsonwebtoken');
const randomWords = require('random-words');

const User = require('../models/user');

exports.loginUser = async(req, res) => {
    const username: String = req.body.username;
    const enteredPassword: String = req.body.password;

    try {
        const user: IUser = await User.findOne({userName: username});
        if (user === null) {
            res.send({message: "The username you entered is not registered."})
        } else if (user.password !== enteredPassword) {
            res.send({message: "Incorrect password"})
        } else {
            const payload = {
                username: user.username
            }
            var token = jwt.sign({
                payload: payload
            }, user.secret, { expiresIn: '12h' });
            res.send({token: token})
        }

    } catch(err) {
        console.log(err)
        res.status(400).send({message: "Error Logging in User"})
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

exports.createUser = async(req, res) => {
    try {
        var newUser = new User({
            ...req.body,
            secret: randomWords()
        });
        await newUser.save();

        const payload = {
            username: newUser.username,
        }
        var token = jwt.sign({
            payload: payload
        }, newUser.secret, { expiresIn: '12h' });
        res.send({token: token})

    } catch(err) {
        console.log(err);
        res.status(400).send({message: "Error getting users"});
    }
}

exports.delete = async(req, res) => { //Verify JWT for this route
    try {
        await User.deleteOne({username: req.params.username});
        //Delete their items and posts here
        res.send({userRemoved: req.params.number})
    } catch(err) {
        console.log(err)
        res.status(400).send({message: "Error getting users"})
    }
}