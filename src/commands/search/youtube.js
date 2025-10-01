import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";
import * as badwords from "badwords-list";

export default {
    name: "youtube",
    description: "Searches YouTube for videos related to the provided query.",
    options: [
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "The search query to look up on YouTube",
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
                    "Google Search Error",
                    "#FF0000",
                );
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        await interaction.deferReply();

        try {
            const data = await fetchRyzumiAPI("/search/yt", { query: query });

            const videos = data.videos;

            if (videos.length === 0) {
                const embed = createSimpleEmbed(
                    `No valid video results found for: **${query}**`,
                    "YouTube Search",
                    "#FF0000",
                );
                return interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            let currentIndex = 0;

            const generateEmbed = (index) => {
                const currentVideo = videos[index];
                return new EmbedBuilder()
                    .setColor("#0099FF")
                    .setTitle(currentVideo.title)
                    .setURL(currentVideo.url)
                    .setImage(currentVideo.thumbnail)
                    .setDescription(currentVideo.description)
                    .addFields([
                        {
                            name: "Views",
                            value: `${currentVideo.views}`,
                            inline: true,
                        },
                        {
                            name: "Duration",
                            value: currentVideo.duration.timestamp,
                            inline: true,
                        },
                        {
                            name: "Channel",
                            value: `[${currentVideo.author.name}](${currentVideo.author.url})`,
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: `Video ${index + 1} of ${videos.length} | Searched for: ${query}`,
                    });
            };

            const prevButton = new ButtonBuilder()
                .setCustomId("prev-image")
                .setLabel("◀ Previous")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const nextButton = new ButtonBuilder()
                .setCustomId("next-image")
                .setLabel("Next ▶")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(videos.length <= 1);

            const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

            const reply = await interaction.followUp({
                embeds: [generateEmbed(currentIndex)],
                components: [row],
            });

            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                idle: 60000,
            });

            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({
                        content: "You can't use these buttons.",
                        ephemeral: true,
                    });
                }

                await i.deferUpdate();

                if (i.customId === "prev-image") {
                    currentIndex--;
                } else if (i.customId === "next-image") {
                    currentIndex++;
                }

                prevButton.setDisabled(currentIndex === 0);
                nextButton.setDisabled(currentIndex === videos.length - 1);

                await interaction.editReply({
                    embeds: [generateEmbed(currentIndex)],
                    components: [new ActionRowBuilder().addComponents(prevButton, nextButton)],
                });
            });

            collector.on("end", async (collected, reason) => {
                if (reason === "idle") {
                    const disabledRow = new ActionRowBuilder().addComponents(
                        prevButton.setDisabled(true),
                        nextButton.setDisabled(true),
                    );

                    await interaction.editReply({ components: [disabledRow] });
                }
            });
        } catch (error) {
            console.error(`Error fetching Google search results: ${error.message}`);
            const embed = createSimpleEmbed(
                "An error occurred while fetching the search results.",
                "Google Search Error",
                "#FF0000",
            );

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};
