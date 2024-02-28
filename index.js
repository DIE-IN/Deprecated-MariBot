       const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
      const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
     const { NID_AUT, NID_SES, Token, clientId } = require("./secret.json");
    const { administrator } = require("./administrator.json");
   const { YtDlpPlugin } = require('@distube/yt-dlp');
  const { DisTube } = require('distube');
 const { color } = require("./color");
const client = new Client({intents: Object.keys(GatewayIntentBits).map((a)=>{return GatewayIntentBits[a]})});
const request = require('request');
 const iconv = require('iconv-lite');
  const player = createAudioPlayer();
   const charset = require('charset');
    const 양소리 = './양소리.txt';
     const path = require('path');
      const api = require("buzzk");
       const fs = require('fs');

  var resource = createAudioResource('./alert.mp3');
 var connection = null;
var channel3 = null;
 var joined = false;
  var count = 0;

process.env.YTSR_NO_UPDATE = "1";

function obj(object) {
    return Object.getOwnPropertyNames(object)
}
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

client.distube = new DisTube(client, {
      emitAddSongWhenCreatingQueue: false,
     emitAddListWhenCreatingQueue: false,
    plugins: [new YtDlpPlugin()],
     emitNewSongOnly: true,
      leaveOnStop: false,
});

client.commands = new Collection();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
        if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(Token);
(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
	} catch (error) {
		console.error(error);
	}
})();

async function main() {
    let search = await api.channel.search("명훈명훈");
    let channel = search[0];
    let chat = new api.chat(channel.channelID);

    await chat.connect()

    chat.onMessage(async (data) => {
        for (let o in data) {
            if (joined) {
                resource = createAudioResource('./alert.mp3');
                connection.subscribe(player);
                player.play(resource);
            }

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

     if (msg.content == "join") {
        async function d() {
            channel3 = await client.channels.fetch("1210860341119156224")
            connection = joinVoiceChannel({
                channelId: channel3.id,
                guildId: channel3.guild.id,
                adapterCreator: channel3.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            joined = true
        } d()
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        await command.execute(interaction);
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId == 'eval' && administrator.includes(interaction.user.id)) {
            try {
                let st = new Date().getTime()
                let ev = eval(interaction.fields.getTextInputValue('code'))
                if (String(ev).length <= 1999) {
                    await interaction.reply(`\`\`\`js\n${String(ev)}\n\`\`\`\n${String(new Date().getTime() - st)}ms`).catch((err)=>{
                        interaction.reply({
                            ephemeral: true,
                            content: `${String(err)}\n${String(new Date().getTime() - st)}ms`
                        })
                    })
                }
                else {
                    let file = `./eval/${new Date().getTime()}.js`
                    fs.writeFile(file, String(ev), (err) => {
                        interaction.reply({files: [file]})
                    })
                }
            } catch (err) {
                let st = new Date().getTime()
                await interaction.reply({
                    ephemeral: true,
                    content: `${String(err)}\n${String(new Date().getTime() - st)}ms`
                })
            }
        } else {
            await interaction.reply({
                ephemeral: true,
                content: `관리자가 아닙니다.`
            })
        }
    } else if (interaction.isAutocomplete()) {
        if (interaction.commandName == "재생") {
            const command = interaction.client.commands.get(interaction.commandName);
            let string = encodeURI(interaction.options.getString('제목', true))
            if (string.length >= 1) {
                request.get({
                    uri: `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&hl=ko&gl=kr&q=${string}}`,
                    encoding: null
                }, (err, res, body) => {
                    if (err) console.log(err);
                    const enc = charset(res.headers, body) // 해당 사이트의 charset값을 획득
                    const i_result = iconv.decode(body, enc) // 획득한 charset값으로 body를 디코딩
                    const arr = JSON.parse(i_result.substring(i_result.indexOf("["), i_result.indexOf("])") + 1));
                    interaction.respond(
                        arr[1].map(a => ({name: a[0], value: a[0]}))
                    )
                })
            }
        }
    }
})

client.on('ready', async (client) => {
    console.log(`Discord Connected!`)
    api.login(NID_AUT, NID_SES)
    main()
})

client.login(Token)