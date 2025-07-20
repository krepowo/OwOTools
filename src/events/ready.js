import { Client, Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    run: async (client) => {
        console.log(`Logged in as ${client.user.tag}!`);

        // console.log(client.commands)
        client.application.commands.set(client.commands);
        console.log(`Registered ${client.commands.size} commands.`);
    },
};
