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
    name: "google-lens",
    description: "Searches Google Lens for images related to the provided query.",
    options: [
        {
            name: "image",
            type: ApplicationCommandOptionType.Attachment,
            description: "The image to search on Google Lens",
            required: true,
        },
    ],
    category: "TOOLS",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const image = interaction.options.getAttachment("image")?.url;
        if (!image) {
            const embed = createSimpleEmbed(
                "You must provide an image to search on Google Lens.",
                "Google Lens Error",
                "#FF0000",
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (badwords.array.some((word) => image.toLowerCase().includes(word))) {
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
            const data = await fetchRyzumiAPI("/search/lens", {
                url: image,
            });

            const filteredResults = data.result
                .filter(
                    (image) =>
                        image.image.link &&
                        image.image.link.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
                        isDiscordSafe(image.image.link),
                )
                .map((image) => ({
                    title: image.title,
                    image: image.image.link,
                    url: image.link,
                }));

            if (filteredResults.length === 0) {
                const embed = createSimpleEmbed(
                    "No valid image results found.",
                    "Google Image Search",
                    "#FF0000",
                );
                return interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            let currentIndex = 0;

            const generateEmbed = (index) => {
                const currentImage = filteredResults[index];
                return new EmbedBuilder()
                    .setColor("#0099FF")
                    .setTitle(currentImage.title)
                    .setURL(currentImage.url)
                    .setImage(currentImage.image)
                    .setThumbnail(image)
                    .setFooter({
                        text: `Image ${index + 1} of ${filteredResults.length}`,
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
                .setDisabled(filteredResults.length <= 1);

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
                nextButton.setDisabled(currentIndex === filteredResults.length - 1);

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
            console.error(`Error fetching Google Lens results: ${error.message}`);
            const embed = createSimpleEmbed(
                "An error occurred while fetching the search results.",
                "Google Lens Error",
                "#FF0000",
            );

            await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};

function isDiscordSafe(urlString) {
    try {
        const url = new URL(urlString);
        if (!["http:", "https:"].includes(url.protocol)) return false;
        if (/[<>\s]/.test(urlString)) return false;
        const badInPath = url.pathname.split("/").some((seg) => /[:']/.test(seg));
        if (badInPath) return false;
        return true;
    } catch {
        return false;
    }
}
