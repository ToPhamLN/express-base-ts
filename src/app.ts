import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import middleware from "i18next-http-middleware";
import { initI18Config } from "@/configs";
import { corsOptions, definedSwaggerDocs } from "@/configs";
import defineRoutes from "./routes";
import { ErrorMiddleware } from "./middlewares";

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config() {
        this.app.use(cors(corsOptions));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
    }

    public async initializeApp() {
        await this.initI18n();
        this.routes();
        this.errorHandling();
        return this.app;
    }

    private async initI18n() {
        const i18Config = await initI18Config();
        this.app.use(
            middleware.handle(i18Config, {
                removeLngFromUrl: true,
            }) as unknown as express.RequestHandler
        );
        this.app.use((req, res, next) => {
            res.locals.t = req.t ?? i18Config.t;
            next();
        });
    }

    private routes() {
        definedSwaggerDocs(this.app);
        defineRoutes(this.app);
        this.app.get("/api/v1/", (req, res) => {
            res.send(req.t("common:welcome"));
        });
    }

    private errorHandling() {
        this.app.use(ErrorMiddleware.notFound);
        this.app.use(ErrorMiddleware.handler);
    }
}

export default App;
