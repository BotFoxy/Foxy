const colors = require('../structures/color');

module.exports = {
  nome: 'mchead',
  aliases: ['mchead'],
  cooldown: 5,
  guildOnly: false,

  async run(client, message, args) {
    const user = args.join(' ');
    if (!user) return message.channel.send('<:Minecraft:804858374780878868> **|** Especifique um usuário');

    const discord = require('discord.js');
    const head = `https://mc-heads.net/head/${user}`;

    const embed = new discord.MessageEmbed()
      .setColor(colors.mine)
      .setTitle(`Cabeça de ${user}`)
      .setImage(head);
    message.channel.send(embed);
  },
};
