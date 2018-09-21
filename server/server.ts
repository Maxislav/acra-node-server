import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import { autobind } from './decorator';


class App {
    private express: any;
    private server: any;

    constructor(private port: number) {
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded());
        this.server = new http.Server(this.express);
        this.server.listen(port, this.serverStart);

    }

    @autobind()
    serverStart(): void {
        console.log(`node server start on port: ${this.port}`);
    }

    public get(url, callback: (req, res) => void): App {
        this.express.get(url, callback);
        return this;
    }

    public post(url, callback: (req, res) => void): App {
        this.express.post(url, callback);
        return this;
    }
}

export const app = new App(8085);