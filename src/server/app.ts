import * as bodyParser from 'body-parser';
import cookieParser = require("cookie-parser"); 
import express = require("express");
import cors = require("cors");
import * as path from "path";
import webpack = require("webpack");

import { AppRouter } from "./AppRouter";
import Loadable from 'react-loadable';

import proxy from 'express-http-proxy';

const expressStaticGzip = require("express-static-gzip")
const webpackHotServerMiddleware = require("webpack-hot-server-middleware");
const configDevClient = require("../config/webpack.dev-client.ts");
const configDevServer = require("../config/webpack.dev-server.ts");
const configProdClient = require("../config/webpack.prod-client.ts");
const configProdServer = require("../config/webpack.prod-server.ts");
const config = require("../config");

class App {
  private app: express.Application;
  private isBuilt: boolean;
  private isDev: boolean;
  private port: number;
  private public_path: string;

  constructor() {
    this.app = express();

    this.initializeStates();
    this.initializeMiddlewares();
    this.initializeWebpack();
  }

  public listen() {
    if (this.isBuilt) return
    Loadable.preloadAll().then(() => {
      this.app.listen(this.port, () => {
        this.isBuilt = true
        console.log(
          `Server listening on http://*.local:${this.port} in ${process.env.NODE_ENV}`
        )
      })
    });
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
    this.app.use(
      '/api',
      proxy(config.server_address, {
        proxyReqOptDecorator(opts) {
          opts.headers['x-forwarded-host'] = config.domain;
          return opts;
        }
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(cors());
    this.app.use('/public', express.static(this.public_path));
    this.app.use(AppRouter.getInstance());
  }

  private initializeWebpack() {
    if (this.isDev) {
      const compiler = webpack([configDevClient, configDevServer])

      const clientCompiler = compiler.compilers[0]
      const serverCompiler = compiler.compilers[1]

      const webpackDevMiddleware = require("webpack-dev-middleware")(
        compiler,
        configDevClient.devServer
      )

      const webpackHotMiddlware = require("webpack-hot-middleware")(
        clientCompiler,
        configDevClient.devServer
      )

      this.app.use(webpackDevMiddleware)
      this.app.use(webpackHotMiddlware)

      this.app.use(webpackHotServerMiddleware(compiler))

      console.log("Middleware enabled")
    } else {
      webpack([configProdClient, configProdServer]).run((err: any, stats: any) => {
        const clientStats = stats.toJson().children[0]
        const render = require("../build/prod-server-bundle.js").default
        console.log(
          stats.toString({
            colors: true
          })
        )

        this.app.use(
          expressStaticGzip("dist", {
            enableBrotli: true
          })
        )

        this.app.use(render({ clientStats }))
      })
    }
  }
}

export default App;
