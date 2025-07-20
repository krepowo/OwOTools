import {
    ActionRowBuilder,
    AttachmentBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { fetchRyzumiAPI } from "../../utils/ryzumi.js";

export default {
    name: "carbon",
    category: "TOOLS",
    description: "Create a Carbon image of your code",
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    run: async (interaction) => {
        const modals = new ModalBuilder().setCustomId("carbon-create").setTitle("Create Carbon Image");

        const text = new TextInputBuilder()
            .setCustomId("carbon-text")
            .setLabel("Enter your code")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const arr = new ActionRowBuilder().addComponents(text);
        modals.addComponents(arr);

        interaction.showModal(modals);
    },
    /**
     * @param {import('discord.js').CommandInteraction} interaction
     */
    modals: async (modalName, interaction) => {
        if (modalName === "create") {
            const code = interaction.fields.getTextInputValue("carbon-text");

            await interaction.deferReply();
            try {
                const res = await fetchRyzumiAPI("/tool/carbon", { code }, "arraybuffer"); // res media type is image/png
                const buffer = Buffer.from(res);
                const att = new AttachmentBuilder(buffer, { name: "carbon.png" });

                const embed = new EmbedBuilder()
                    .setColor("#0099ff")
                    .setTitle("Your Carbon Image")
                    .setDescription("Here is the Carbon image of your code:")
                    .setImage("attachment://carbon.png");
                interaction.followUp({ embeds: [embed], files: [att] });
            } catch (error) {
                console.error(`Error fetching Carbon image: ${error.message}`);
                await interaction.followUp({
                    content: "There was an error while generating the Carbon image!",
                    ephemeral: true,
                });
            }
        }
    },
};
