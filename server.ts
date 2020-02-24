const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const app = express();

const user = require('./routes/user'); // Imports routes for the user
const university = require('./routes/university'); // Imports routes for the universities
const image = require('./routes/image'); // Imports routes for the images


const {postUnivData} = require('./initializeUnivData/postUnivData');

//Set up mongoose connection
const mongoose = require('mongoose');

var MONGODB;
if (process.env.NODE_ENV == 'test') {
    MONGODB = process.env.MONGODBTEST || "mongodb://localhost:27017";
} else {
    MONGODB = process.env.MONGODB || "mongodb://localhost:27017";
}

mongoose.connect(MONGODB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.Promise = global.Promise;
const myReactAppDb = mongoose.connection;
myReactAppDb.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

app.use('/user', user);
app.use('/university', university);
app.use('/image', image);

app.get('/version', (req, res) => {
    res.send( {version: `Current version of Node: ${process.version}`} );
});

app.get('/UnivData', postUnivData);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;