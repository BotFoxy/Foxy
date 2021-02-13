const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "atm",
    aliases: ['money', 'atm'],
    cooldown: 5,
    guildOnly: false,

    async execute(client, message, args) {
        const db = require('quick.db')
        let user = message.mentions.members.first() || message.author;

        let bal = db.fetch(`coins_${user.id}`)
        let bank = db.fetch(`bal_${user.id}`)
        if(bank === null) bank = 0;
        if (bal === null) bal = 0;
    
        if(message.content.includes("all")) {
            const embed = new MessageEmbed()
            .setColor("f0152d")
            .setTitle("Saldo Bancário")
            .setThumbnail("https://cdn.discordapp.com/attachments/776930851753426945/810193222471122964/logo-bradesco-escudo-1024.png")
            .addFields(
                { name: "<:BradescoLogo:810176327993917520> **|** Saldo Bancário", value: `${bank} FoxCoins`},
                { name: "<:Santander:810177139252133938> **|** Conta Corrente", value: `${bal} FoxCoins`}
            )
            message.channel.send(embed)
        } else {
                if(user == message.author) return message.channel.send(`💵 **|** ${user} você possui ${bal} FoxCoins`)
      
        message.channel.send(`💵 **|** ${message.author}, ${user} possui ${bal} FoxCoins`)
        
        }
    }
}

