
module.exports = {
    name: "8ball",
    aliases: ['8ball', 'eightball', '8', 'ask'],
    cooldown: 5,
    guildOnly: false,
    argsRequire: true,
    async execute(client, message, args) {

        let results = ["Sim", "Não", "Talvez", "Com certeza!", "Talvez", "Provavelmente sim", "Provavelmente não", "Não entendi, pergunte novamente"]
        let result = results[Math.floor((Math.random() * results.length))]
        message.channel.send([result])


    }
}