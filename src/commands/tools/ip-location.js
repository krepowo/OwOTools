import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import { createSimpleEmbed } from '../../utils/embed.js';
import { fetchRyzumiAPI } from '../../utils/ryzumi.js';

export default {
    name: 'ip-location',
    description: 'Retrieves location and other details of the provided IP address.',
    options: [
        {
            name: 'ip',
            type: ApplicationCommandOptionType.String,
            description: 'The IP address to look up',
            required: true
        }
    ],
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const ip = interaction.options.getString('ip');
        if (!ip) {
            const embed = createSimpleEmbed("Please provide a valid IP address.", 'IP Location Error', '#FF0000');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip) === false) {
            const embed = createSimpleEmbed("Please provide a valid IP address.", 'IP Location Error', '#FF0000');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();
        try {
            const data = await fetchRyzumiAPI('/tool/iplocation', { ip: ip });

            if (data.ipInfo.error) {
                const embed = createSimpleEmbed('Invalid IP address provided.', 'IP Location Error', '#FF0000');
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('IP Location Information')
                .setDescription('Result for IP: ' + data.ipInfo.ip)
                .addFields([
                    {
                        name: 'Network',
                        value: `- **IP:**${data.ipInfo.ip}\n- **Network:** ${data.ipInfo.network}\n- **Version:** ${data.ipInfo.version}\n- **ASN:** ${data.ipInfo.asn}\n- **ISP:** ${data.ipInfo.org}`,
                    },
                    {
                        name: 'Region',
                        value: `- **Country:** ${data.ipInfo.country_name}\n- **Region:** ${data.ipInfo.region}\n- **City:** ${data.ipInfo.city}\n- **Latitude:** ${data.ipInfo.latitude}\n- **Longitude:** ${data.ipInfo.longitude}`,
                    }
                ])
                .setColor("#0099FF")
                .setTimestamp();

            return interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(`Error fetching IP location: ${error.message}`);
            const embed = createSimpleEmbed('An error occurred while fetching the IP location.', 'IP Location Error', '#FF0000');
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
};