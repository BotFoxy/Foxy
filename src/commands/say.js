const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient("WEBHOOK-ID", "YOUR-WEBHOOK-TOKEN");
module.exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      "<:WindowsShield:777579023249178625> | Você não tem permissão para executar este comando! Você precisará da permissão `Gerenciar Mensagens` para usar este comando!"
    );
  const sayMessage = args.join(' ');
      const noargs = new Discord.MessageEmbed()
.setColor('BLUE')
.setTitle('Como usar')
.setDescription('💁‍♀️ **Exemplo:** `f!say yay!` \n 🛑 **Permissões:** Você precisará da permissão `Gerenciar mensagens` para usar este comando.')

if (!sayMessage) return message.channel.send(noargs)
if(sayMessage == '@everyone' || '@here') return message.channel.send(`${message.author}, Você não pode mencionar everyone ou here, Faça isso você mesmo!`)
  message.channel.send(`${sayMessage} \n\n<:cat_toes:781335367764803634> *Mensagem enviada por ${message.author}*`)
    const embed = new Discord.MessageEmbed()
    .setTitle('Logs de comandos')
    .setDescription(`**Comando:** f!say \n **Autor:** ${message.author.tag} / ${message.author.id} \n\n **Servidor** ${message.guild.name} / ${message.guild.id} \n\n **Mensagem:** ${sayMessage} \n\n Link: [Mensagem](${message.url})`)
webhookClient.send( {
    username: `Logs`,
    avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
    embeds: [embed],
});
}