import { EmbedBuilder } from "discord.js";

export default {
    name: "stats",
    category: "INFO",
    description: "View bot statistics",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */
    run: async (interaction, client) => {
        const serverCount = client.guilds.cache.size;
        const channelCount = client.channels.cache.size;

        const embed = new EmbedBuilder()
            .setTitle("Bot Statistics")
            .setColor("#0099ff")
            .setDescription(
                `**Servers:** \`${serverCount}\`
                **Channels:** \`${channelCount}\`
                **Ping:** \`${client.ws.ping}ms\`
                **Uptime:** \`${formatUptime(client.uptime / 1000)}\`\n
                **Total commands:** \`${client.commands.size}\`
                **Command runned since start:** \`${client.totalCommandRuns + 1}\``,
            )
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};

function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = uptime.toFixed(0) % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
