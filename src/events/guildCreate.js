module.exports = async (guild) => {
    const Discord = require('discord.js')
    const { guildsWebhook } = require('../config.json');
    const webhookClient = new Discord.WebhookClient(webhook.id, webhook.token);
    const embed = new Discord.MessageEmbed()
        .setTitle('Logs de entrada e saída')
        .setDescription(`<:MeowPuffyMelt:776252845493977088> Fui adicionada em um servidor`)
    webhookClient.send({
        username: `Logs`,
        avatarURL: 'https://cdn.discordapp.com/attachments/766414535396425739/789255465125150732/sad.jpeg',
        embeds: [embed],
    });
}