import {
    ApplicationCommandOptionType,
    ContainerBuilder,
    MessageFlags,
    SeparatorSpacingSize,
} from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";
import { fetchNekolabsAPI } from "../../utils/nekolabs.js";

export default {
    name: "tiktok-dl",
    description: "Tiktok media downloader",
    options: [
        {
            name: "link",
            type: ApplicationCommandOptionType.String,
            description: "The link to the video you want to download",
            required: true,
        },
    ],
    category: "DOWNLOADER",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const link = interaction.options.getString("link");

        await interaction.deferReply();
        try {
            const res = await fetchNekolabsAPI("/downloader/tiktok", { url: link });
            if (!res.status) {
                const embed = createSimpleEmbed(
                    "Invalid Tiktok link",
                    "Tiktok-dl Error",
                    "#FF0000",
                );
                return interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            const abcd = new ContainerBuilder()
                .setAccentColor(0x0099ff)
                .addSectionComponents((s) =>
                    s
                        .addTextDisplayComponents((td) =>
                            td.setContent(
                                `## ${res.result.title}\n-# ${res.result.create_at}\n ▶ ${res.result.stats.play} | ❤️ ${res.result.stats.like} | 💬 ${res.result.stats.comment} | 🔁 ${res.result.stats.share}`,
                            ),
                        )
                        .setThumbnailAccessory((t) => t.setURL(res.result.cover)),
                )
                .addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Small))
                .addMediaGalleryComponents((media) =>
                    media.addItems((item) =>
                        item.setDescription("Tiktok Media Downloader").setURL(res.result.videoUrl),
                    ),
                )
                .addTextDisplayComponents((td) =>
                    td.setContent(
                        `-# ${currentImage.music_info.title} | ${currentImage.music_info.author}`,
                    ),
                );

            await interaction.followUp({
                components: [abcd],
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.error("Error fetching IG Downloader:", error);
            const embed = createSimpleEmbed(
                "There was an error while processing your request.",
                "Tiktok-dl Error",
                "#FF0000",
            );
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
