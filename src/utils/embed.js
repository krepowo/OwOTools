import { EmbedBuilder } from "discord.js";

export function createSimpleEmbed(description, title = null, color = "#0099FF", footer = null) {
    return new EmbedBuilder()
        .setDescription(description)
        .setTitle(title)
        .setColor(color)
        .setFooter(footer);
}
