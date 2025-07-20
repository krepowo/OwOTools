import { ApplicationCommandOptionType, ContainerBuilder, MessageFlags } from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";

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
            const res = await fetchRyzumiAPI("/downloader/v2/ttdl", { url: link });
            if (!res.success) {
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
                .addTextDisplayComponents((td) => td.setContent("Tiktok Media Downloader"))
                .addMediaGalleryComponents((media) =>
                    media.addItems((item) =>
                        item
                            .setDescription("Tiktok Media Downloader")
                            .setURL(res.data.video_data.nwm_video_url_HQ),
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
