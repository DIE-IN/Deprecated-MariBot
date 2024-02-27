const api = require("buzzk");
const { NID_AUT, NID_SES, Token } = require("./secret.json")
const fs = require('fs');
const 양소리 = './양소리.txt';
const chatApi = api.chat
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection } = require('@discordjs/voice');
const player = createAudioPlayer();
const { color } = require("./color.js")
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a)=>{
      return GatewayIntentBits[a]
    })
})

var count = 0

var resource = createAudioResource('./alert.mp3');
var connection = null
var channel3 = null

function obj(object) {
    return Object.getOwnPropertyNames(object)
}

api.login(NID_AUT, NID_SES)

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

async function main() {
    let search = await api.channel.search("명훈명훈")
    let channel = search[0]
    let chat = new chatApi(channel.channelID)
    await chat.connect()

    async function d() {
        channel3 = await client.channels.fetch("1210860341119156224")
        connection = joinVoiceChannel({
            channelId: channel3.id,
            guildId: channel3.guild.id,
            adapterCreator: channel3.guild.voiceAdapterCreator,
            selfDeaf: false
        });
    } d()

    chat.onMessage(async (data) => {
        for (let o in data) {
            resource = createAudioResource('./alert.mp3');
            connection.subscribe(player);
            player.play(resource);

            var date = new Date(data[o].time);
            var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            async function c() {
                client.channels.fetch("1211979981387857951").then(async channel => {
                    await channel.send(`[${time}] ${data[o].author.name}: ${data[o].message}`)
                    console.log(`${color.fg.red}[${time}] ${data[o].author.name}: ${data[o].message}${color.reset}`);
                    sleep(10000)
                })
            }

            console.log(`[${time}] ${data[o].author.name}: ${data[o].message}`);

			if (data[o].message === "!굿즈") {
                await chat.send("[봇] https://voiij.kr/shop_view/?idx=183");
                c()
            }

            if (data[o].message === "!팔로우") {
                let followTime = Date.parse((await chat.getUserInfo(data[o].author.id)).followDate)
                let live = await api.live.getDetail(channel.channelID)
                await chat.send(`[봇] ${data[o].author.name}님이 ${live.channel.name}님을 팔로우 하신 지 ${((date.getTime() - followTime) / 1000 / 60 / 60 /24).toFixed(0)}일째입니다`)
                c()
            }

            if (data[o].message === "!게임") {
                await chat.send(`[봇] 게임: ${(await api.live.getDetail(channel.channelID)).category}`);
                c()
            }

            if (data[o].message === "!방제") {
                let live = await api.live.getDetail(channel.channelID)
                await chat.send(`[봇] 방제: ${live.title}`);
                c()
            }

            if (data[o].message === "!시청자") {
                let live = await api.live.getDetail(channel.channelID)
                await chat.send(`[봇] 시청자 수: ${live.userCount.now}`);
                c()
            }

            if (data[o].message.includes("양소리") && !data[o].message.includes("번")) {
                fs.readFile(양소리, "utf-8", (err, file) => {
                    count = Number(file) + 1
                    fs.writeFile(양소리, String(count), (err) => {
                        async function a() {
                            let live = await api.live.getDetail(channel.channelID)
                            await chat.send(`[봇] ${live.channel.name}님이 총 ${count}번 양소리를 하셨습니다.`)
                            console.log(count)
                            c()
                        }
                        a()
                    })
                });
            }

            if (data[o].message === "!핑") {
                let st = new Date().getTime()
                await chat.getUserInfo(data[o].author.id).then(async a=>{
                    await chat.send(`[봇] 핑: ${String(new Date().getTime() - st)}ms`)
                    c()
                })
            }
        }
    })
}

client.on('messageCreate', async msg => {
    if (msg.author.id === "596928010200809493" && msg.channelId === "1210873941833547776" && msg.content.startsWith("ev ")) {
        try {
            let st = new Date().getTime()
            let ev = eval(msg.content.split("ev ")[1])
            if (String(ev).length <= 1999) {
                msg.channel.send(`\`\`\`js\n${String(ev)}\n\`\`\`\n${String(new Date().getTime() - st)}ms`).catch((err)=>{
                    msg.channel.send(`${String(err)}\n${String(new Date().getTime() - st)}ms`)
                })
            }
            else {
                let file = `./eval/${new Date().getTime()}.js`
                fs.writeFile(file, String(ev), (err) => {
                    msg.channel.send({files: [file]})
                })
            }
        } catch (err) {
            msg.channel.send(`${String(err)}\n${String(new Date().getTime() - st)}ms`)
        }
    }
})

client.on('ready', async (client) => {
    main()
})

client.login(Token)