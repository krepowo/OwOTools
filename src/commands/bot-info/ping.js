import { createSimpleEmbed } from "../../utils/embed.js";

export default {
    name: "ping",
    category: "INFO",
    description: "Ping the bot to check if it is online",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const ping = interaction.client.ws.ping;
        const embed = createSimpleEmbed(`Websocket: \`${ping}ms\``, "🏓 Pong!", "#0099ff");

        const then = performance.now();
        await interaction.reply({ embeds: [embed] });
        const now = performance.now();
        const latency = now - then;

        embed.data.description += `\nAPI Latency: \`${latency.toFixed(2)}ms\``;
        await interaction.editReply({ embeds: [embed] });
    },
};
