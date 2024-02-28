const { SlashCommandBuilder } = require('discord.js')
let { tier } = require('../../RPS.json')
const EloRank = require('elo-rank');
const elo = new EloRank(50)
const fs = require('fs')

class Player {
    constructor(id, name, win, lose, el) {
        this.id = id,
        this.name = name,
        this.win = win,
        this.lose = lose,
        this.elo = el
    }
}

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
            // win
            if (winner[bot] == user) {
                let resultJson = {'name': interaction.user.displayName, 'win': info.win + 1, 'lose': info.lose, 'draw': info.draw, 'elo': elo.updateRating(elo.getExpected(info.elo, 1000), 1, info.elo)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}
                    봇: ${bot}
                    승리!
                    점수: ${resultJson.elo}(+${pmelo})`
                })
                return resultJson
            }
            // lose
            else if (winner[user] == bot) {
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose + 1, 'draw': info.draw, 'elo': elo.updateRating(elo.getExpected(info.elo, 1000), 0, info.elo)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}
                    봇: ${bot}
                    패배!
                    점수: ${resultJson.elo}(${pmelo})`
                })
                return resultJson
            }
            // draw
            else {
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose, 'draw': info.draw + 1, 'elo': elo.updateRating(elo.getExpected(info.elo, 1000), 0.5, info.elo)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}
                    봇: ${bot}
                    무승부!
                    점수: ${resultJson.elo}(${pmelo > -1 ? "+" : ""}${pmelo})`
                })
                return resultJson
            }
        }
        if (!tier[interaction.user.id]) {
            tier[interaction.user.id] = {'name': interaction.user.displayName, 'win': 0, 'lose': 0, 'draw': 0, 'elo': 1000}
        }
        tier[interaction.user.id] = result(tier[interaction.user.id])
        fs.writeFileSync('RPS.json', JSON.stringify({'tier': tier}))
    }
}