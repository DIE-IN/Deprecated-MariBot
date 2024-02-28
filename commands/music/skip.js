const { SlashCommandBuilder } = require('discord.js')
const ytdl = require('ytdl-core')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('스킵')
        .setDescription('노래를 스킵합니다.'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction)
        if (!queue) return interaction.reply({ephemeral: true, content: 'X'})
        try {
            const song = await queue.skip()
            interaction.reply(`노래 스킵. ${song.name} 재생.`)
        } catch (e) {
            interaction.reply({ephemeral: true, content: String(e)})
        }
    }
}