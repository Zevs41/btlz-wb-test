import winston from "winston";
import env from "#config/env/env.js";

const defaultLevel = env.NODE_ENV === "production" ? "info" : "debug";
const level = env.LOG_LEVEL ?? defaultLevel;

export const logger = winston.createLogger({
    level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => {
                    const { timestamp, level: lvl, message, ...meta } = info;
                    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
                    return `${timestamp} [${lvl}] ${message}${metaStr}`;
                }),
            ),
        }),
    ],
});

