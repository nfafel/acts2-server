import {IUniversity} from '../interfaces/IUniversity';
const University = require('../models/university');

exports.getSearchResults = async(req, res) => {
    try {
        const universities: IUniversity = await University.find({name: {$regex : req.params.search, $options: "i"}}).limit(10);
        res.send({universities: universities})
    } catch(err) {
        console.log(err);
        res.status(400).send({message: "Error Logging in User"})
    }
}