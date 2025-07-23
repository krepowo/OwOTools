import { ApplicationCommandOptionType, ContainerBuilder, MessageFlags } from "discord.js";
import { createSimpleEmbed } from "../../utils/embed.js";

export default {
    name: "instagram-dl",
    description: "Instagram media downloader",
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
            const abcd = new ContainerBuilder()
                .setAccentColor(0x0099ff)
                .addTextDisplayComponents((td) => td.setContent("Instagram Media Downloader"))
                .addMediaGalleryComponents((media) =>
                    media.addItems((item) =>
                        item
                            .setDescription("Instagram Media Downloader")
                            .setURL(link.replace("www.instagram.com", "kkinstagram.com")),
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
                "Instagram-dl Error",
                "#FF0000",
            );
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
