const Discord = require('discord.js');

module.exports = {
  name: 'botinfo',
  aliases: ['client', 'clientinfo', 'bot'],
  cooldown: 5,
  guildOnly: false,
  async run(client, message) {
    let cpu = Math.round(process.cpuUsage().system / 1024 / 1024).toString();
    if (cpu < 1) {
      cpu = (process.cpuUsage().system / 1024 / 1024).toFixed();
    }

    let totalSeconds = client.uptime / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const uptime = `${days.toFixed()}d ${hours.toFixed()}h ${minutes.toFixed()}m ${seconds.toFixed()}s`;
    const promises = [
      client.shard.fetchClientValues('guilds.cache.size'),
      client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
    ];

    Promise.all(promises)
      .then((results) => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

        const ajuda = new Discord.MessageEmbed()

          .setColor('BLUE')
          .setTitle('Olá! Eu me chamo Foxy')
          .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
          .setDescription(`Olá, eu sou a Foxy, tenho 15 anos \n Atualmente estou espalhando alegria em **${totalGuilds}** servidores :heart:! \n Faz **${uptime}** que eu acordei desde 26 de Julho de 2020 \n\n Eu fui criada em <:JavaScript:797192542810406984> JavaScript utilizando a lib discord.js e se você quiser ver como fui desenvolvida acesse https://github.com/BotFoxy/FoxyBot`)
          .addFields(
            { name: '<:AddMember:797181629826859029> Me adicione', value: '[Me adicione clicando aqui](https://discord.com/oauth2/authorize?client_id=737044809650274325&permissions=8&scope=bot)', inline: true },
            { name: '<:DiscordExplore:790934280611037196> Servidor de Suporte', value: '[Entre no meu servidor](https://discord.gg/gK42WTs)', inline: true },
            { name: ' <:Twitter:797184287816286209> Meu Twitter', value: '[@FoxyDiscordBot](https://twitter.com/FoxyDiscordBot)', inline: true },
            { name: '<:paypal:776965353904930826> Doe para mim', value: '[Doe para mim clicando aqui](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN)', inline: true },
            { name: '👑 Menções Incríveis', value: `• **Win#8379** | Se não fosse ele, eu nem iria existir \n • **Bis❄#2332** | Por fazer meu icon e outros desenhos :heart: \n • **Arthur Kohler** | Por me ajudar a ficar online! :heart: \n • **ThierrY** | Por me ajudar fazendo divulgações :3 :heart: \n • Todas as **${totalMembers}** pessoas que usaram meus comandos \n • E você ${message.author} que está falando comigo!` },
          )
          .setFooter('Foxy foi criada por Win#8379', 'https://cdn.discordapp.com/attachments/776930851753426945/797186564747690024/Win.png');

        message.reply(ajuda);
      });
  },

};
