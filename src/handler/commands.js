import { glob } from "glob";
import { pathToFileURL } from "url";
import logger from "../utils/logger.js";

export default async function (client) {
    const commandFiles = await glob(`${process.cwd()}/src/commands/**/*.js`);
    commandFiles.map(async (file) => {
        const commandModule = await import(pathToFileURL(file));
        const command = commandModule.default;
        if (!command || !command.name) {
            logger.warn(`Command at ${file} has no default export or name.`);
            return;
        }
        if (typeof command.run !== "function") {
            logger.warn(`Command ${command.name} at ${file} does not have a run method.`);
            return;
        }
        client.commands.set(command.name, command);
        logger.debug(`Command ${command.name} loaded from ${file}.`);
    });
    return client.commands;
}
