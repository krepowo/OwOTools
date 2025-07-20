import { EmbedBuilder } from "discord.js";

export default {
    name: "help",
    category: "INFO",
    description: "Display all available commands",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */
    run: async (interaction, client) => {
        const embed = new EmbedBuilder()
            .setTitle("Available Commands")
            .setDescription(
                "Here are the commands you can use with this bot. Use `/command_name` to execute a command.",
            )
            .setColor("#0099FF");

        const categories = client.commands.reduce((acc, command) => {
            if (!command.category) return acc;

            if (!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(`\`${command.name}\``);
            return acc;
        }, {});

        for (const [category, cmds] of Object.entries(categories)) {
            embed.addFields({
                name: category,
                value: cmds.join(", "),
            });
        }
        interaction.reply({ embeds: [embed] });
    },
};
