import { createLogger, format, transports, Logger } from "winston";
import dayjs from "dayjs";

export const logger: Logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: () => dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "app.log" }),
    ],
});
