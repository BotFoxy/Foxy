const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports = class WebhookManager {
    constructor(client) {
        this.client = client;
    }

    async sendSuggestion(interaction, suggestion) {
        const suggest = new MessageEmbed()
            .setTitle('Nova sugestão para a Foxy!')
            .setThumbnail(interaction.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setDescription(`${this.client.emotes.heart} **Usuário:** ${interaction.user.tag} / ${interaction.user.id} \n\n ${this.client.emotes.success} **Sugestão:** ${suggestion} \n\n ${this.client.emotes.thumbsup} **Servidor:** ${interaction.guild.name} / ${interaction.guild.id}`)

        const suggestWebhook = new WebhookClient({ url: this.client.config.webhooks.suggestions, disableEveryone: true });
        suggestWebhook.send({ embeds: [suggest] });
    }

    async guildCreate(guild) {
        const guildEmbed = new MessageEmbed()
            .setTitle(`${this.client.emotes.success} | Fui adicionada em um servidor! :3`)
            .setThumbnail('https://cdn.discordapp.com/attachments/782995363548102676/839517480640577536/yay_fast.gif')
            .setDescription(`<a:cat_explosion:831146965479063553> Fui adicionada no servidor **${guild.name}**`)
            .setFooter({ text: `ID do Servidor: ${guild.id}` })

        const guildWebhook = new WebhookClient({ url: this.client.config.webhooks.guilds, disableEveryone: true });
        guildWebhook.send({ embeds: [guildEmbed] });
    }

    async guildDelete(guild) {
        const guildEmbed = new MessageEmbed()
            .setTitle(`${this.client.emotes.error} | Fui removida de um servidor! :c`)
            .setThumbnail('https://cdn.discordapp.com/attachments/791449801735667713/791450113649410078/tenor.gif')
            .setDescription(`<a:cat_explosion:831146965479063553> Fui removida do servidor **${guild.name}**`)
            .setFooter({ text: `ID do Servidor: ${guild.id}` })

        const guildWebhook = new WebhookClient({ url: this.client.config.webhooks.guilds, disableEveryone: true });
        guildWebhook.send({ embeds: [guildEmbed] });
    }

    async sendIssue(interaction, content) {
        const issueEmbed = new MessageEmbed()
            .setTitle(`${this.client.emotes.error} | Um erro foi reportado por um usuário`)
            .addFields(
                { name: "👤 | Usuário", value: `\`${interaction.user.tag} / ${interaction.user.id}\`` },
                { name: "✨ | Servidor", value: `\`${interaction.guild.name} / ${interaction.guild.id}\`` },
                { name: "❌ | Problema", value: `\`${content}\`` }
            )

        const issueWebhook = new WebhookClient({ url: this.client.config.webhooks.issues, disableEveryone: true });
        issueWebhook.send({
            username: interaction.user.username,
            avatarURL: interaction.user.displayAvatarURL(),
            embeds: [issueEmbed]
        });
    }
}