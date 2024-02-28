const { SlashCommandBuilder } = require('discord.js')
let { tier15 } = require('../../RPS-15.json')
const EloRank = require('elo-rank');
const elo = new EloRank(32)
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('가위불바위총번개악마용물공기보스펀지늑대나무사람뱀')
        .setDescription('봇과 가위불바위총번개악마용물공기보스펀지늑대나무사람뱀을 합니다.')
        .addStringOption(option => {
            return option
                .setName('내기')
                .setDescription('낼거')
                .addChoices({"name": "가위", "value": "가위"},
                  {"name": "불", "value": "불"},
                  {"name": "바위", "value": "바위"},
                  {"name": "총", "value": "총"},
                  {"name": "번개", "value": "번개"},
                  {"name": "악마", "value": "악마"},
                  {"name": "용", "value": "용"},
                  {"name": "물", "value": "물"},
                  {"name": "공기", "value": "공기"},
                  {"name": "보", "value": "보"},
                  {"name": "스펀지", "value": "스펀지"},
                  {"name": "늑대", "value": "늑대"},
                  {"name": "나무", "value": "나무"},
                  {"name": "사람", "value": "사람"},
                  {"name": "뱀", "value": "뱀"})
                .setRequired(true)
        }),
    async execute(interaction) {
        let array = [
            "보", "스펀지", "늑대", "나무", "사람", "뱀", "가위", "불", "바위", "총", "번개", "악마", "용", "물", "공기"
        ]
        let winArray = {
            바위: ["불", "가위", "뱀", "사람", "늑대", "스펀지", "나무"],
            불: ["가위", "보", "뱀", "사람", "나무", "늑대", "스펀지"],
            가위: ["공기", "나무", "보", "뱀", "사람", "늑대", "스펀지"],
            뱀: ["사람", "늑대", "스펀지", "나무", "보", "공기", "물"],
            사람: ["나무", "늑대", "스펀지", "보", "공기", "물", "용"],
            나무: ["늑대", "용", "스펀지", "보", "공기", "물", "악마"],
            늑대: ["스펀지", "보", "공기", "물", "용", "번개", "악마"],
            스펀지: ["보", "공기", "물", "악마", "용", "총", "번개"],
            보: ["공기", "바위", "물", "악마", "용", "총", "번개"],
            공기: ["불", "바위", "물", "악마", "총", "용", "번개"],
            물: ["악마", "용", "바위", "불", "가위", "총", "번개"],
            용: ["악마", "번개", "불", "바위", "가위", "총", "뱀"],
            악마: ["바위", "불", "가위", "총", "번개", "뱀", "사람"],
            번개: ["총", "가위", "바위", "나무", "불", "뱀", "사람"],
            총: ["바위", "나무", "불", "가위", "뱀", "사람", "늑대"],
        };
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
            let bot = array[Math.floor(Math.random() * array.length)]
            let result = null
            if (user === bot) {
                result = null;
            }
            winArray[user].includes(bot) ? result = true : result = false;
            if (result == true) {
                let points = elo.updateRating(elo.getExpected(info.elo, 2000), 1, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win + 1, 'lose': info.lose, 'draw': info.draw, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n승리!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (+${pmelo})`
                })
                return resultJson
            }
            else if (result == false) {
                let points = elo.updateRating(elo.getExpected(info.elo, 2000), 0, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose + 1, 'draw': info.draw, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n패배!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (${pmelo})`
                })
                return resultJson
            }
            else if (result == null) {
                let points = elo.updateRating(elo.getExpected(info.elo, 2000), 0.5, info.elo)
                let resultJson = {'name': interaction.user.displayName, 'win': info.win, 'lose': info.lose, 'draw': info.draw + 1, 'elo': points, 'rankTier': ti(points)}
                let pmelo = resultJson.elo - info.elo
                interaction.reply({
                    ephemeral: true,
                    content: `${interaction.user.displayName}: ${user}\n봇: ${bot}\n무승부!\n${(ti(points) == info.rankTier) ? info.rankTier : `${info.rankTier} -> ${ti(points)}`} ${resultJson.elo} (${pmelo > -1 ? "+" : ""}${pmelo})`
                })
                return resultJson
            }
        }
        if (!tier15[interaction.user.id]) {
            tier15[interaction.user.id] = {'name': interaction.user.displayName, 'win': 0, 'lose': 0, 'draw': 0, 'elo': 1200, 'rankTier': "IRON IV"}
        }
        tier15[interaction.user.id] = result(tier15[interaction.user.id])
        fs.writeFileSync('RPS-15.json', JSON.stringify({'tier15': tier15}))
    }
}