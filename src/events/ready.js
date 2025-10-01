import { ActivityType, Client, Events } from "discord.js";
import logger from "../utils/logger.js";

export default {
    name: Events.ClientReady,
    once: true,
    /**
     *
     * @param {Client} client
     */
    run: async (client) => {
        logger.info(`Logged in as ${client.user.tag}!`);

        client.application.commands.set(client.commands);
        logger.info(`Registered ${client.commands.size} commands.`);

        const updateActivity = () => {
            client.user.setActivity({
                name: `${client.guilds.cache.size} servers | /help`,
                type: ActivityType.Listening,
            });
        };

        updateActivity();
        setInterval(updateActivity, 60000);
    },
};
