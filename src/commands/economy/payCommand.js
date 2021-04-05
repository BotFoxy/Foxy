const { MessageEmbed } = require('discord.js')
const db = require('quick.db');

module.exports = {
  name: 'pay',
  aliases: ['pay', 'pagar'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const payEmbed = new MessageEmbed()
      .setColor(client.colors.green)
      .setTitle('💸 | `f!pay`')
      .setDescription("Você deve estar devendo alguma coisa, ou querendo ajudar um amigo, de FoxCoins a ele :D\n\n 📚 **Exemplos**")
      .addFields(
      { name: "🔹 Pagar pessoa via menção", value: "`f!pay @Win#8379 500`"},
      { name: "🔹 Pagar 1000 FoxCoins", value: "`f!pay @Win#8379 1000`"},
      { name: "ℹ Aliases:", value: "`pagar`"}
      ) 
      .setFooter(`• Autor: ${message.author.tag} - Economia`, message.author.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));

    const user = message.mentions.members.first();

    if (user == message.author.id) return message.reply('Você não pode transferir coins para si mesmo');
    if (!user) {
      return message.reply(payEmbed);
    }

    if (isNaN(args[1])) return message.reply('Digite números válidos!');

    if (!args[1]) {
      return message.reply('Especifique uma quantidade para ser transferida');
    }

    if (message.content.includes('-')) {
      return message.reply('Você não pode transferir coins negativas');
    }

    const fetchValue = db.fetch(`coins_${message.author.id}`);

    if (args[1] > fetchValue) return message.reply('Você não tem coins suficiente');

    message.reply(`💸 **|** Você deseja mesmo transferir ${args[1]} FoxCoins para ${user.user}? \nA Equipe da Foxy **Não se responsabiliza** pelas FoxCoins perdidas, então certifique-se de estar transferindo para uma pessoa de confiança! \nÉ proibido o comércio de conteúdo NSFW(+18) em troca de FoxCoins!`).then((sentMessage) => {
      sentMessage.react('✅');
      const filter = (reaction, usuario) => reaction.emoji.name === '✅' && usuario.id === message.author.id;
      const Collector = sentMessage.createReactionCollector(filter, { max: 1, time: 60000 });

      sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })

      Collector.on('collect', () => {
        message.reply(`Você fez uma transação de ${args[1]} FoxCoins para ${user.user}`);
        db.add(`coins_${user.id}`, args[1]);
        db.subtract(`coins_${message.author.id}`, args[1]);
      })

    });
  },
};
