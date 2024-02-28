const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong!'),
    async execute(interaction) {
        await interaction.reply(`레이턴시: ${Date.now() - interaction.createdTimestamp}ms. API 레이턴시: ${Math.round(interaction.client.ws.ping)}ms`)
    }
}