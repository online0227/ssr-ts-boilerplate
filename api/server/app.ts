import * as bodyParser from 'body-parser';import cookieParser from "cookie-parser";import mongoose from 'mongoose';import express from "express";import cors from "cors";
import * as path from "path";
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

import { AppRouter } from "./AppRouter";

const config = require("./config");

class App {
  private app: express.Application;
  private isBuilt: boolean;
  private isDev: boolean;
  private port: number;
  private public_path: string;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeStates();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    if (this.isBuilt) return
    this.app.listen(this.port, () => {
      this.isBuilt = true
      console.log(
        `Server listening on http://*.local:${this.port} in ${process.env.NODE_ENV}`
      )
    })
  }

  public getServer() {
    return this.app;
  }

  private initializeStates() {
    let isProd = process.env.NODE_ENV === "production";
    this.isDev = !isProd;
    this.port = process.env.PORT || config.port;
    this.isBuilt = false;
    this.public_path = path.resolve('wwwroot', '../public/');
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use('/public', express.static(this.public_path));
    this.app.use(AppRouter.getInstance());
    this.app.get('/', (req, res) => {

      res.send(`
        <div>
          <h4>ssr-ts-boilerplate api server</h4>
          <div>
            welcome!
          </div>
        </div>
      `);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });  }

  private connectToTheDatabase() {
    mongoose
      .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD
      })
      .then(() => console.log("DB Connected"));
  }
}

export default App;
