import pino from "pino";

const logger = pino({
    level: process.env.SONTOL,
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss Z",
            ignore: "pid,hostname",
        },
    },
});

export default logger;
