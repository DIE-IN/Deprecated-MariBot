const { SlashCommandBuilder } = require('discord.js')
let { tier } = require('../../RPS.json')
const EloRank = require('elo-rank');
const elo = new EloRank(16)
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('가위바위보')
        .setDescription('봇과 가위바위보를 합니다.')
        .addStringOption(option => {
            return option
                .setName('내기')
                .setDescription('낼거')
                .addChoices({name: '가위', value: '가위'}, {name: '바위', value: '바위'}, {name: '보', value: '보'})
                .setRequired(true)
        }),
    async execute(interaction) {

        let array = ['가위', '바위', '보']
        let bot = array[Math.floor(Math.random() * array.length)];
        let winner = {'가위': '바위', '바위': '보', '보': '가위'}
        let user = interaction.options.getString('내기')
        function result(info) {
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
            // win
            if (winner[bot] == user) {
                let points = elo.updateRating(elo.getExpected(info.elo, 1625), 1, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win + 1, 'lose': info.lose, 'draw': info.draw, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n승리!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (+${pmelo})`
                })
                return resultJson
            }
            // lose
            else if (winner[user] == bot) {
                let points = elo.updateRating(elo.getExpected(info.elo, 1625), 0, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose + 1, 'draw': info.draw, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n패배!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (${pmelo})`
                })
                return resultJson
            }
            // draw
            else {
                let points = elo.updateRating(elo.getExpected(info.elo, 1625), 0.5, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose, 'draw': info.draw + 1, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n무승부!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (${pmelo > -1 ? "+" : ""}${pmelo})`
                })
                return resultJson
            }
        }
        if (!tier[interaction.user.id]) {
            tier[interaction.user.id] = {'name': interaction.user.displayName, 'win': 0, 'lose': 0, 'draw': 0, 'elo': 1200, 'rankTier': "IRON IV"}
        }
        tier[interaction.user.id] = result(tier[interaction.user.id])
        fs.writeFileSync('RPS.json', JSON.stringify({'tier': tier}))
    }
}