import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { fetchRyzumiAPI } from '../../utils/ryzumi.js';
import { createSimpleEmbed } from '../../utils/embed.js';

export default {
    name: 'x-dl',
    description: 'Twitter/X media downloader',
    options: [
        {
            name: 'link',
            type: ApplicationCommandOptionType.String,
            description: 'The link to the video you want to download',
            required: true
        }
    ],
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const link = interaction.options.getString('link');

        await interaction.deferReply();
        try {
            const res = await fetchRyzumiAPI('/downloader/v2/twitter', { url: link });
            console.log(res);
            if (res.status && res.status == false) {
                const embed = createSimpleEmbed("Invalid X link", "X-dl Error", '#FF0000');
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor("#0099FF")
                .setDescription(`[Click here to download the video](${res[0].url})`);

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching X Downloader:', error);
            const embed = createSimpleEmbed('There was an error while processing your request.', 'X-dl Error', '#FF0000');
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
};