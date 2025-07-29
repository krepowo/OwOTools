import { glob } from "glob";
import { pathToFileURL } from "url";
import logger from "../utils/logger.js";

export default async function (client) {
    const eventFiles = await glob(`${process.cwd()}/src/events/**/*.js`);

    for (const file of eventFiles) {
        const eventModule = await import(pathToFileURL(file));
        const event = eventModule.default;

        if (!event) {
            logger.warn(`Event at ${file} has no default export.`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }

        logger.debug(`Event ${event.name} loaded.`);
    }
}
