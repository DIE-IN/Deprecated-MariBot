const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('administrator permission command'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('eval')
            .setTitle('eval')
        const codeInput = new TextInputBuilder()
            .setCustomId('code')
            .setLabel('code')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder('code')
        modal.addComponents(new ActionRowBuilder().addComponents(codeInput))
        await interaction.showModal(modal)
    }
}