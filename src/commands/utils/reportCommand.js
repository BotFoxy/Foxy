const Discord = require('discord.js');
module.exports = {
  name: 'report',
  aliases: ['reportar', 'report', 'bug', 'issue'],
  cooldown: 3,
  guildOnly: true,
  async run(client, message, args) {
    const sayMessage = args.join(' ');
    const noargs = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTitle('Como usar')
      .setDescription('<:meowbughunter:776249240463736834> **Reporte falhas para meu servidor de suporte** \n 💁‍♀️ **Exemplo:** `f!report bot retorna undefined`');

    if (!sayMessage) return message.reply(noargs);
    message.reply(`Obrigada por me ajudar ${message.author}, seu report foi enviado com sucesso! <:meow_blush:768292358458179595>`);
    
    client.hook.reportHook()
  },

};
