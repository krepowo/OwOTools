import { ApplicationCommandOptionType } from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";

export default {
    name: "tinyurl",
    description: "Create a shortened URL using TinyURL",
    options: [
        {
            name: "url",
            type: ApplicationCommandOptionType.String,
            description: "The URL to shorten",
            required: true,
        },
    ],
    category: "TOOLS",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const url = interaction.options.getString("url");

        try {
            const res = await fetchRyzumiAPI("/tool/tinyurl", { url });
            const embed = createSimpleEmbed(res.shortUrl);
            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(`Error shortening URL: ${err.message}`);
            await interaction.reply({
                content: "There was an error while shortening the URL!",
                ephemeral: true,
            });
        }
    },
};
