import { glob } from "glob";
import { pathToFileURL } from "url";

export default async function (client) {
    const commandFiles = await glob(`${process.cwd()}/src/commands/**/*.js`);
    commandFiles.map(async (file) => {
        const commandModule = await import(pathToFileURL(file));
        const command = commandModule.default;
        if (!command || !command.name) {
            console.warn(`Command at ${file} has no default export or name.`);
            return;
        }
        if (typeof command.run !== "function") {
            console.warn(`Command ${command.name} at ${file} does not have a run method.`);
            return;
        }
        client.commands.set(command.name, command);
        console.log(`Command ${command.name} loaded from ${file}`);
    });
    return client.commands;
}
