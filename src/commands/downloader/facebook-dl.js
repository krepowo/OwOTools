import { ApplicationCommandOptionType, ContainerBuilder, MessageFlags } from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";

export default {
    name: "facebook-dl",
    description: "facebook media downloader",
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
            const res = await fetchRyzumiAPI("/downloader/fbdl", { url: link });
            if (!res.status) {
                const embed = createSimpleEmbed(
                    "Invalid facebook link",
                    "Facebook-dl Error",
                    "#FF0000",
                );
                return interaction.followUp({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            const abcd = new ContainerBuilder()
                .setAccentColor(0x0099ff)
                .addTextDisplayComponents((td) => td.setContent("Facebook Media Downloader"))
                .addMediaGalleryComponents((media) =>
                    media.addItems((item) =>
                        item
                            .setDescription("Fesnuk Media Downloader")
                            .setURL(res.data[0].url.replace("&dl=1", "")),
                    ),
                );

            await interaction.followUp({
                components: [abcd],
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.error("Error fetching Facebook-dl:", error);
            const embed = createSimpleEmbed(
                "There was an error while processing your request.",
                "facebook-dl Error",
                "#FF0000",
            );
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
