module.exports = {
  name: 'pay',
  aliases: ['pay', 'pagar'],
  cooldown: 5,
  guildOnly: true,

  async run(client, message, args) {
    const db = require('quick.db');
    const user = message.mentions.members.first();

    const member = db.fetch(`coins_${message.author.id}`);

    if (user == message.author.id) return message.reply('Você não pode transferir coins para si mesmo');
    if (!user) {
      return message.reply('Mencione alguém que deseja transferir seus coins');
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
