const { SlashCommandBuilder } = require('discord.js')
const ytdl = require('ytdl-core')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('종료')
        .setDescription('재생을 종료합니다.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({ephemeral: true, content: 'X'})
        queue.stop()
        interaction.reply("재생 종료.")
    }
}