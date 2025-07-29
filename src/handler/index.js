import { glob } from "glob";
import { pathToFileURL } from "url";
import logger from "../utils/logger.js";

export default async function (client) {
    const handlerFiles = await glob(`${process.cwd()}/src/handler/**/*.js`);
    for (const file of handlerFiles) {
        if (file.endsWith("index.js")) continue;
        const handlerModule = await import(pathToFileURL(file));
        const handler = handlerModule.default;

        if (!handler) {
            logger.warn(`Handler at ${file} has no default export.`);
            continue;
        }

        if (typeof handler === "function") {
            await handler(client);
            logger.debug(`Loading handler from ${file}`);
        }
    }
}
