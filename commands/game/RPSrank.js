const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
let { tier } = require('../../RPS.json')
const EloRank = require('elo-rank');

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
        .setDescription('가위바위보의 랭킹을 봅니다.'),
    async execute(interaction) {
        const players = [];
        for (const playerId in tier) {
            const playerData = tier[playerId];
            players.push(new Player(playerId, playerData.name, playerData.win, playerData.lose, playerData.draw, playerData.elo));
        }
        let embed = new EmbedBuilder()
            .setTitle('가위바위보 랭킹')
        players.sort((a, b) => b.elo - a.elo);
        let rank = 1
        for (const player of players) {
            embed.addFields([
                {name: `${rank}위`, value: `[${player.name}](https://discord.com/users/${player.id})\n${player.win}승 / ${player.lose}패 (${player.win / (player.win + player.lose) * 100}%)\n${player.elo}점`}
            ])
            rank += 1
        }
        
        interaction.reply({embeds: [embed]})
    }
}