import { Request, Response, NextFunction, Router } from 'express';
import * as path from "path";
import * as fs from "fs";
import marked from "marked";
import * as yaml from "yaml-front-matter";

import Controller from '../interfaces/controller.interface';
import MarkdownNotFoundException from '../exceptions/MarkdownNotFoundException';

class MarkdownController implements Controller {
    public path = '/markdown';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/Homepage`, this.loadMarkdown);
    }

    private loadMarkdown = async (request: Request, response: Response, next: NextFunction) => {        const site = request.headers.site;        
        const file = path.resolve(__dirname, `../../data/${site}/Homepage.md`);

        fs.readFile(file, "utf8", (err: any, data: any) => {
            if (err) {
                next(new MarkdownNotFoundException(`${site}/Homepage.md`));
            } else {
                const obj = yaml.loadFront(data);
                let obj2 = { ...obj, __content:marked(obj.__content)};
                response.send(obj2);
            }
        })
    }
}

export default MarkdownController;
