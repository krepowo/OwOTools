import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    EmbedBuilder,
    MessageFlags,
    SeparatorSpacingSize,
} from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";
import { createSimpleEmbed } from "../../utils/embed.js";
import { fetchNekolabsAPI } from "../../utils/nekolabs.js";
import axios from "axios";

export default {
    name: "youtube-dl",
    description: "Youtube videos downloader",
    options: [
        {
            name: "link",
            type: ApplicationCommandOptionType.String,
            description: "The link to the video you want to download",
            required: true,
        },
        {
            name: "format",
            type: ApplicationCommandOptionType.String,
            description: "The format of the video you want to download",
            required: true,
            choices: [
                { name: "mp3", value: "mp3" },
                { name: "144p", value: "144" },
                { name: "240p", value: "240" },
                { name: "360p", value: "360" },
                { name: "480p", value: "480" },
                { name: "720p", value: "720" },
                { name: "1080p", value: "1080" },
            ],
        },
    ],
    /**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    run: async (interaction) => {
        const link = interaction.options.getString("link");
        const resolution = interaction.options.getString("format");

        await interaction.deferReply();
        try {
            const res = await fetchNekolabsAPI("downloader/youtube/v1", {
                url: link,
                format: resolution,
            });
            if (!res.status) {
                console.log(res);
                const embed = createSimpleEmbed(
                    "Invalid youtube link",
                    "Youtube-DL Error",
                    "#FF0000",
                );
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const abcd = new ContainerBuilder().setAccentColor(0x0099ff);

            if (resolution === "mp3") {
                interaction.followUp({ content: "Work in progress..." });
                // Please make a pull request if you succeed sending an audio with non english title (japanese, chinese, korean, etc)
            } else {
                abcd.addSectionComponents((s) =>
                    s
                        .addTextDisplayComponents((td) =>
                            td.setContent(
                                `## ${res.result.title}\n-# ${res.result.quality}p | ${res.result.duration}`,
                            ),
                        )
                        .setThumbnailAccessory((t) => t.setURL(res.result.cover)),
                );
                abcd.addSeparatorComponents((s) => s.setSpacing(SeparatorSpacingSize.Small));
                abcd.addMediaGalleryComponents((m) =>
                    m.addItems((i) => i.setURL(res.result.downloadUrl)),
                );

                await interaction.followUp({
                    components: [abcd],
                    flags: MessageFlags.IsComponentsV2,
                });
            }
        } catch (error) {
            console.error("Error fetching YouTube DL:", error);
            const embed = createSimpleEmbed(
                "There was an error while processing your request.",
                "YouTube-DL Error",
                "#FF0000",
            );
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
