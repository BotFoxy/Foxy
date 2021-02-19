const { prefix } = require('../../config.json');
module.exports = async (client) => {

    console.info(`\x1b[37m\x1b[42mSUCCESS\x1b[0m: Foxy is ready! Logged as: ${client.user.tag}`);
    let status = [
        { name: `❓ Se você precisa de ajuda use ${prefix}help`, type: "WATCHING" },
        { name: `💻 Quer encontrar meus comandos use: ${prefix}commands`, type: "PLAYING" },
        { name: "🐦 Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
        { name: `💖 Fui criada pelo WinG4merBR#5995`, type: "LISTENING" },
        { name: `😍 Me adicione usando ${prefix}invite`, type: "WATCHING" },
        { name: `✨ Entre no meu servidor de suporte usando ${prefix}help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
        { name: `🐛 Se você encontrou um bug use ${prefix}report para reportar falhas`, type: "PLAYING" },
        { name: `🍰 Minha comida preferida é bolo 💖`, type: "WATCHING" },
        { name: "❤ A Shiro é minha amiguinha OwO", type: "WATCHING"},
        { name: `😍 Espalhando alegria e felicidade em ${client.guilds.cache.size} Servidores! :3`}
    ];

    setInterval(() => {
        let randomStatus = status[Math.floor(Math.random() * status.length)];
        client.user.setPresence({ activity: randomStatus });
    }, 10000);

    let profilePics = [
        "https://cdn.discordapp.com/attachments/776930851753426945/811265067227545630/foxy_cake.png",
        "https://cdn.discordapp.com/attachments/776930851753426945/811265068741165056/foxybis.png",
        "https://cdn.discordapp.com/attachments/776930851753426945/811265070221885500/foxy_vlogs.png",
        "https://cdn.discordapp.com/attachments/776930851753426945/811265109728034846/Foxy.png"
    ];

    setInterval(() => {
        let x = profilePics[Math.floor(Math.random() * profilePics.length)];
        client.user.setAvatar(x);
	console.log("Profile Changed")
    }, 18000000)
}