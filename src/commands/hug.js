const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  

var list = [
  'https://i.imgur.com/wOmoeF8.gif',
  'https://media1.tenor.com/images/43fce3d874179afb2d9d74a7402dcff4/tenor.gif?itemid=17264448',
  'https://thumbs.gfycat.com/WellgroomedVapidKitten-small.gif'
];

var rand = list[Math.floor(Math.random() * list.length)];
let user = message.mentions.users.first() || client.users.cache.get(args[0]);
if (!user) {
return message.reply('lembre-se de mencionar um usuário válido para abraçar!');
}

let avatar = message.author.displayAvatarURL({format: 'png'});
  const embed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setDescription(`${message.author} **abraçou** ${user}`)
        .setImage(rand)
        .setTimestamp()
        .setFooter('Made with 💖 by WinG4merBR')
  await message.channel.send(`${message.author}`, embed)
}
