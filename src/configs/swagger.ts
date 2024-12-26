import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WWW.com documents API",
            description: "Describe response and params API.",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local server",
            },
        ],
    },
    apis: ["./src/routers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const definedSwaggerDocs = (app: Application) => {
    app.use("/docs-api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
