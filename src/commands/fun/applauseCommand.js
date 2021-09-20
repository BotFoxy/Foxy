const Discord = require('discord.js');

module.exports = {
  name: 'applause',
  aliases: ['app', 'aplause'],
  cooldown: 2,
  guildOnly: true,
  clientPerms: ['ATTACH_FILES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],

  async run(client, message, args) {
    const list = [
      'https://media1.tenor.com/images/3a79f7bc177a52f81b5e858066b3e70a/tenor.gif?itemid=7820542',
      'https://media1.tenor.com/images/efed02e6e183d25013e81cfe044575ef/tenor.gif?itemid=5115515',
      'https://media1.tenor.com/images/14b8c5c916ea6b890df27bd05a71145f/tenor.gif?itemid=10810505',
      'https://media.tenor.com/images/02adadfc08cb92b7f188df32ba4c23a5/tenor.gif',
      'https://media1.tenor.com/images/a2ca44e80b00f0231f53b5e3569d58fa/tenor.gif?itemid=16860038',
    ];

    const rand = list[Math.floor(Math.random() * list.length)];
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      return message.foxyReply('lembre-se de mencionar um usuário válido para apaludir');
    }

    const avatar = message.author.displayAvatarURL({ format: 'png' });
    const embed = new Discord.MessageEmbed()
      .setDescription(`${message.author} está aplaudindo ${user}`)
      .setImage(rand)
      .setTimestamp()
      
      .setAuthor(message.author.tag, avatar);
    await message.foxyReply(embed);
  },

};
