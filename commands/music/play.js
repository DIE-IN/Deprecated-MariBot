const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')
const request = require('request')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('재생')
        .setDescription('유튜브에서 영상을 검색합니다.')
        .addStringOption(option => {
            return option
                .setName('제목')
                .setDescription('검색할 영상의 제목입니다.')
                .setAutocomplete(true)
        }),
    async execute(interaction) {
        interaction.client.distube.play()
    }
}