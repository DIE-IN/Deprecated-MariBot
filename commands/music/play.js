const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const ytdl = require('ytdl-core')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('재생')
        .setDescription('유튜브에서 영상을 검색합니다.')
        .addStringOption(option => {
            return option
                .setName('제목')
                .setDescription('검색할 영상의 제목입니다.')
                .setAutocomplete(true)
                .setRequired(true)
        }),
    async execute(interaction) {
        interaction.client.distube.play(interaction.member.voice.channel, interaction.options.getString('제목', true), {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })
        interaction.deferReply()
        interaction.client.distube.on("playSong", async (queue, song) => {
            await ytdl.getInfo(song.url).then(async videos =>{
                let video = videos.videoDetails
                let uploader = video.author
                function truncateString(str=String(), numLines=Number()) {
                    const lines = str.split('\n');
                    if (lines.length <= numLines) {
                      return str;
                    }
                    const truncatedLines = lines.slice(0, numLines);
                    return truncatedLines.join('\n');
                }
                if (video.description) {
                    embed = new EmbedBuilder()
                        .setAuthor({name: uploader.name, url: uploader.channel_url, iconURL: uploader.thumbnails[0].url})
                        .setTitle(video.title)
                        .setDescription(truncateString(video.description.replaceAll("\n\n", "\n"), 5) + `\n[...더보기](${song.url})`)
                        .setTimestamp(Date.parse(video.uploadDate))
                        .setImage(song.thumbnail)
                        .setURL(song.url)
                    interaction.editReply({embeds:[embed]})
                } else {
                    embed = new EmbedBuilder()
                        .setAuthor({nname: uploader.name, url: uploader.channel_url, iconURL: uploader.thumbnails[0].url})
                        .setTitle(video.title)
                        .setDescription("노래를 재생합니다.")
                        .setTimestamp(Date.parse(video.uploadDate))
                        .setImage(song.thumbnail)
                        .setURL(song.url)
                    interaction.editReply({embeds:[embed]})
                }
            }).catch(e=>{
                console.log(e)
            })
        })

    }
}