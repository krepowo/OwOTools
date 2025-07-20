import { glob } from "glob";
import { pathToFileURL } from "url";

export default async function (client) {
    const eventFiles = await glob(`${process.cwd()}/src/events/**/*.js`);

    for (const file of eventFiles) {
        const eventModule = await import(pathToFileURL(file));
        const event = eventModule.default;

        if (!event) {
            console.warn(`Event at ${file} has no default export.`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }

        console.log(`Event ${event.name} loaded.`);
    }
}
