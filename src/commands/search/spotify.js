import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    ContainerBuilder,
    MessageFlags,
    SeparatorSpacingSize,
} from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";
import * as badwords from "badwords-list";
import { fetchNekolabsAPI } from "../../utils/nekolabs.js";

export default {
    name: "spotify",
    description: "Search for music on Spotify.",
    options: [
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "The search query to look up on Spotify",
            required: true,
        },
    ],
    category: "SEARCH",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const query = interaction.options.getString("query");

        if (badwords.array.some((word) => query.toLowerCase().includes(word))) {
            if (!interaction.channel.nsfw) {
                const embed = createSimpleEmbed(
                    "Your search query contains inappropriate content.",
                    "Spotify Search Error",
                    "#FF0000",
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        await interaction.deferReply();

        try {
            const res = await fetchNekolabsAPI("discovery/spotify/search", {
                q: query,
            });
            res.result.splice(5);

            if (!res.status) {
                const embed = createSimpleEmbed("No results found.", "Spotify Search", "#FF0000");
                return interaction.followUp({ embeds: [embed] });
            }

            const container = new ContainerBuilder()
                .setAccentColor(0x0099ff)
                .addTextDisplayComponents((t) => t.setContent(`Results for: ${query}`));

            for (const track of res.result) {
                container
                    .addSectionComponents((s) =>
                        s
                            .addTextDisplayComponents((t) =>
                                t.setContent(
                                    `### ${track.title}\n-# by ${track.artist} | ${track.duration}\n[Listen on Spotify](${track.url})`,
                                ),
                            )
                            .setThumbnailAccessory((t) => t.setURL(track.cover)),
                    )
                    .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Small));
            }

            await interaction.followUp({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.log(error);
            const embed = createSimpleEmbed(
                "An error occurred while fetching the search results.",
                "Spotify Search Error",
                "#FF0000",
            );

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
