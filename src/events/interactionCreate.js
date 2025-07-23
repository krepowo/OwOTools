import { Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    /**
     *
     * @param {import('discord.js').Interaction} interaction
     * @param {import('discord.js').Client} client
     */
    run: async (interaction, client) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.warn(`Command ${interaction.commandName} not found.`);
                return;
            }

            try {
                await command.run(interaction, client);
                client.totalCommandRuns++;
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);
                try {
                    await interaction.reply({
                        content: "There was an error while executing this command!",
                        ephemeral: true,
                    });
                } catch (error) {
                    await interaction.followUp({
                        content: "There was an error while executing this command!",
                        ephemeral: true,
                    });
                }
            }
        }

        if (interaction.isModalSubmit()) {
            const commands = client.commands.get(interaction.customId.split("-")[0]);
            const modalName = interaction.customId.split("-")[1];
            if (!commands) {
                console.warn(`Modal handler for ${interaction.customId} not found.`);
                return;
            }

            try {
                await commands.modals(modalName, interaction, client);
            } catch (error) {
                console.error(`Error handling modal ${interaction.customId}:`, error);
                await interaction.reply({
                    content: "There was an error while processing this modal!",
                    ephemeral: true,
                });
            }
        }
    },
};
