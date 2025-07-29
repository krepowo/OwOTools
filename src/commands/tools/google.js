import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";
import * as badwords from "badwords-list";

export default {
    name: "google",
    description: "Searches Google for the provided query.",
    options: [
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "The search query to look up on Google",
            required: true,
        },
    ],
    category: "TOOLS",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const query = interaction.options.getString("query");

        if (badwords.array.some((word) => query.toLowerCase().includes(word))) {
            if (!interaction.channel.nsfw) {
                const embed = createSimpleEmbed(
                    "Your search query contains inappropriate content.",
                    "Google Search Error",
                    "#FF0000",
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        await interaction.deferReply();
        try {
            const data = await fetchRyzumiAPI("/search/google", {
                query: query,
            });
            if (data.length === 0) {
                const embed = new EmbedBuilder()
                    .setDescription(`No results found for: ${query}`)
                    .setColor("#FF0000")
                    .setTimestamp();
                return interaction.followUp({ embeds: [embed] });
            }

            const results = data.map((result) => {
                return `**[${result.title}](${result.link})**\n${result.description}`;
            });

            const embed = new EmbedBuilder()
                .setTitle(
                    `Google Search Results for: ${query > 30 ? query.slice(0, 30) + "..." : query}`,
                )
                .setDescription(results.join("\n\n"))
                .setColor("#0099FF")
                .setTimestamp();

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(`Error fetching Google search results: ${error.message}`);
            const embed = createSimpleEmbed(
                "An error occurred while fetching the search results.",
                "Google Search Error",
                "#FF0000",
            );
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
