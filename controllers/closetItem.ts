import { IClosetItem } from "../interfaces/IClosetItem";
const ClosetItem = require('../models/closetItem');

exports.get = async(req, res) => {
    try{
        const item: IClosetItem = await ClosetItem.findOne({username: req.params.username});
        res.send({closetItem: item});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Item")
    }
}

exports.getByUser = async(req, res) => {
    try{
        const items: IClosetItem = await ClosetItem.find({username: req.params.username});
        res.send({userClosetItem: items});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Items by User")
    }
}

exports.getByUniversity = async(req, res) => {
    try{
        const items: IClosetItem = await ClosetItem.find({username: req.params.universityId});
        res.send({universityClosetItem: items});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error getting Closet Items by University")
    }
}

exports.post = async(req, res) => {
    try{
        const newItemValues: IClosetItem = req.body.item;
        const newItem = new ClosetItem(newItemValues);
        const result: IClosetItem = await newItem.save();
        res.send({newItem: result});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Creating Closet Item")
    }
}

exports.put = async(req, res) => {
    try{
        const updates: IClosetItem = req.body.updates;
        const result: IClosetItem = ClosetItem.findByIdAndUpdate(req.body.closetItemId, updates, {useFindAndModify: false, runValidators: true, new: true });
        res.send({updatedItem: result});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Creating Closet Item")
    }
}

exports.delete = async(req, res) => {
    try{
        await ClosetItem.findByIdAndRemove(req.body.closetItemId);
        res.send({deletedId: req.body.closetItemId});
    } catch(err) {
        console.log(err);
        res.status(400).send("Error Creating Closet Item")
    }
}