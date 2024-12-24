import { corsOptions, definedSwaggerDocs } from "@/configs";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { ErrorMiddleware } from "./middlewares";
import defineRoutes from "./routes";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandling();
    }

    private config() {
        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        definedSwaggerDocs(this.app);
    }

    private routes() {
        defineRoutes(this.app);
        this.app.get("/", (req, res) => {
            res.send("Hello WWW.COM!");
        });
    }

    private errorHandling() {
        this.app.use(ErrorMiddleware.notFound);
        this.app.use(ErrorMiddleware.handler);
    }
}

export default new App().app;
