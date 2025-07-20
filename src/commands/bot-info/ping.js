export default {
    name: "ping",
    description: "Ping the bot to check if it is online",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const ping = interaction.client.ws.ping;
        await interaction.reply(`Pong! 🏓 Latency is ${ping}ms`);
    },
};
