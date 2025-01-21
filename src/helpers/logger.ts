import { createLogger, format, transports, Logger } from "winston";
import chalk from "chalk";
import dayjs from "dayjs";
import path from "path";

const logDirectory = path.resolve(__dirname, "../../logs");

export const logger: Logger = createLogger({
    level: "info",
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: () => dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
        }),
        format.printf(({ timestamp, level, message }) => {
            const coloredTimestamp = chalk.cyan(timestamp);
            const coloredLevel = chalk.bold(level);
            const coloredMessage = chalk.yellow(message);
            return `${coloredTimestamp} [${coloredLevel}]: ${coloredMessage}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(logDirectory, "app.log"),
            level: "info",
            format: format.uncolorize(),
        }),
        new transports.File({
            filename: path.join(logDirectory, "error.log"),
            level: "error",
            format: format.uncolorize(),
        }),
    ],
});
