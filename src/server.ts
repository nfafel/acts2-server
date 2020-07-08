import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import http, { Server } from 'http';
import config from '../config';
import {
    ClosetItemController,
    RootController,
    UniversityController,
    UserController,
    ChatController,
    MessageController,
    AuthorizationController,
} from './controllers';

import {
    notFound,
    internalServerError,
    validationErrorHandler,
} from './lib';

export default class App {
    public express?: Express;
    public server?: Server;
  
    public async start(): Promise<void> {
      // Start your app
      await this.configureMongoose();
      this.configureExpress();
    }
  
    private async configureMongoose(): Promise<void> {
        var MONGODB;
        if (process.env.NODE_ENV == 'test') {
            MONGODB = process.env.MONGODBTEST || 'mongodb://localhost:27017/acts2_test';
        } else {
            MONGODB = process.env.MONGODB || config.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/acts2_dev';
        }

        mongoose.connect(MONGODB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        mongoose.Promise = global.Promise;
        const myReactAppDb = mongoose.connection;
        myReactAppDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
  
    private configureExpress(): void {
        this.express = express();
        this.server = http.createServer(this.express);

        this.express.use(bodyParser.json()); // support json encoded bodies
        this.express.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
        this.express.use(cors());

        this.express.use('/', new RootController().router);
        this.express.use('/authorization', new AuthorizationController().router);
        this.express.use('/user', new UserController().router);
        this.express.use('/university', new UniversityController().router);
        this.express.use('/closet-item', new ClosetItemController().router);
        this.express.use('/chat', new ChatController().router);
        this.express.use('/message', new MessageController().router);

        this.express.use(notFound);
        this.express.use(validationErrorHandler);
        this.express.use(internalServerError);

        const PORT = Number(process.env.PORT) || 8000;

        this.express.set('port', PORT);
        this.server.listen(PORT);
        console.log(`listening on port ${PORT}`);
    }
}

new App().start().catch(err => {
    console.log(err);
});
