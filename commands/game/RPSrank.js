const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
let { tier } = require('../../RPS.json')
let { tier15 } = require('../../RPS-15.json')

class Player {
    constructor(id, name, win, lose, draw, el) {
        this.id = id,
        this.name = name,
        this.win = win,
        this.lose = lose,
        this.draw = draw,
        this.elo = el
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('랭킹')
        .setDescription('가위바위보의 랭킹을 봅니다.')
        .addSubcommand(subcommand => {
            return subcommand
                .setName('가위바위보')
                .setDescription('가위바위보의 랭킹을 봅니다.')
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName('가위불바위총번개악마용물공기보스펀지늑대나무사람뱀')
                .setDescription('가위불바위총번개악마용물공기보스펀지늑대나무사람뱀의 랭킹을 봅니다.')
        }), 
    async execute(interaction) {
        if (interaction.options.getSubcommand() === '가위바위보') {
            const players = [];
            for (const playerId in tier) {
                const playerData = tier[playerId];
                players.push(new Player(playerId, playerData.name, playerData.win, playerData.lose, playerData.draw, playerData.elo));
            }
            let embed = new EmbedBuilder()
                .setTitle('가위바위보 랭킹')
            players.sort((a, b) => b.elo - a.elo);
            let rank = 1
            /**
             * Code Created by Gemini
             * @param {number} eloPoint 
             * @returns {string} rankTier
             */
            function ti(eloPoint){
                const ranks = [
                    "IRON IV", "IRON III", "IRON II", "IRON I",
                    "BRONZE IV", "BRONZE III", "BRONZE II", "BRONZE I",
                    "SILVER IV", "SILVER III", "SILVER II", "SILVER I",
                    "GOLD IV", "GOLD III", "GOLD II", "GOLD I",
                    "PLATINUM IV", "PLATINUM III", "PLATINUM II", "PLATINUM I",
                    "DIAMOND IV", "DIAMOND III", "DIAMOND II", "DIAMOND I",
                    "MASTER", "GRANDMASTER", "CHALLENGER"
                ];
                
                const divisions = [
                    1225, 1250, 1275, 1300,
                    1325, 1350, 1375, 1400,
                    1425, 1450, 1475, 1500,
                    1525, 1550, 1575, 1600,
                    1625, 1650, 1675, 1700,
                    1725, 1750, 1775, 1800,
                    2200, 2600, 3000
                ];
                
                for (let i = 0; i < divisions.length; i++) {
                    if (eloPoint <= divisions[i]) {
                        return ranks[i];
                    }
                }
            }
            for (const player of players) {
                let rankTier = ti(player.elo)
                embed.addFields([
                    {name: `${rank}위`, value: `[${player.name}](discord://-/users/${player.id})\n${player.win}승 / ${player.lose}패 / ${player.draw}무 (${player.win / (player.win + player.lose) * 100}%)\n${rankTier} / ${player.elo}점`}
                ])
                rank += 1
            }
            interaction.reply({embeds: [embed]})
        } else if (interaction.options.getSubcommand() === '가위불바위총번개악마용물공기보스펀지늑대나무사람뱀') {
            const players = [];
            for (const playerId in tier15) {
                const playerData = tier15[playerId];
                players.push(new Player(playerId, playerData.name, playerData.win, playerData.lose, playerData.draw, playerData.elo));
            }
            let embed = new EmbedBuilder()
                .setTitle('가위불바위총번개악마용물공기보스펀지늑대나무사람뱀 랭킹')
            players.sort((a, b) => b.elo - a.elo);
            let rank = 1
            /**
             * Code Created by Gemini
             * @param {number} eloPoint 
             * @returns {string} rankTier
             */
            function ti(eloPoint){
                const ranks = [
                    "IRON IV", "IRON III", "IRON II", "IRON I",
                    "BRONZE IV", "BRONZE III", "BRONZE II", "BRONZE I",
                    "SILVER IV", "SILVER III", "SILVER II", "SILVER I",
                    "GOLD IV", "GOLD III", "GOLD II", "GOLD I",
                    "PLATINUM IV", "PLATINUM III", "PLATINUM II", "PLATINUM I",
                    "DIAMOND IV", "DIAMOND III", "DIAMOND II", "DIAMOND I",
                    "MASTER", "GRANDMASTER", "CHALLENGER"
                ];
                
                const divisions = [
                    1225, 1250, 1275, 1300,
                    1325, 1350, 1375, 1400,
                    1425, 1450, 1475, 1500,
                    1525, 1550, 1575, 1600,
                    1625, 1650, 1675, 1700,
                    1725, 1750, 1775, 1800,
                    2200, 2600, 3000
                ];
                
                for (let i = 0; i < divisions.length; i++) {
                    if (eloPoint <= divisions[i]) {
                        return ranks[i];
                    }
                }
            }
            for (const player of players) {
                let rankTier = ti(player.elo)
                embed.addFields([
                    {name: `${rank}위`, value: `[${player.name}](discord://-/users/${player.id})\n${player.win}승 / ${player.lose}패 / ${player.draw}무 (${player.win / (player.win + player.lose) * 100}%)\n${rankTier} / ${player.elo}점`}
                ])
                rank += 1
            }
            interaction.reply({embeds: [embed]})
        }
    }
}