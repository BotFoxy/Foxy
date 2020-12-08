const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json");
const Enmap = require('enmap')
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.sendStatus(200);
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Port: ' + listener.address().port);
});
client.commands = new Enmap();
const cmd = require('./resposta.json');
client.on("message", message => {
  if (message.author.bot) return false;

 
});
client.on("message", (msg) => {
  if ( msg.content === `<@${client.user.id}>` || msg.content === `<@!${client.user.id}>` ) msg.channel.send(`Olá, ${message.author}! Meu prefixo é ${prefix}`)
})
client.on("message", (Message) => {
  if ( Message.guild.id != "768267522670723094" ) return;

  if ( Message.content.toLowerCase().startsWith("f!notificar") || Message.content.toLowerCase().startsWith("f!notify") ) {
    if ( !Message.member.roles.cache.has("768275121290870814") ) Message.member.roles.add("768275121290870814"), Message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
    else Message.member.roles.remove("768275121290870814"), Message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
}
})
client.on('message', msg => {
    if (msg.author.bot) {
        return;
    }
    responseObject = cmd;
    if(responseObject[msg.content]){
        msg.channel.send(responseObject[msg.content]);
    }
});
 
  console.log(`Sessão Iniciada \nLogado com ${client.guilds.cache.size} guilds desde a inicialização.`)
client.on("ready", () => {
    let activities = [
`❓ Use f!help para obter ajuda`,
      `📷 Avatar por: Bis❄#0001`,
      `😍 Espalhando alegria em ${client.guilds.cache.size} servidores`,
      `😎 Eu sou open-source https://github.com/BotFoxy ＼(^o^)／`,
      `💻 Use f!commands para ver minha lista de comandos`,
      `😍 Tornando seu servidor extraordinário ᕕ(ᐛ)ᕗ`,
      `🐦 Me siga no Twitter @FoxyDiscordBot`,
      `💖 Use f!donate para me ajudar a ficar online!`,
        `🦊 What Does The Fox Say?`,
        `🎅 Feliz natal a todos! ❤`

  ],

  i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
  activities.length]}`,{
    type: "WATCHING"
  }), 5000);
    
  console.log(`Sessão Iniciada \nLogado com ${client.guilds.cache.size} guilds desde a inicialização.`)
  })
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;

    let props = require(`./commands/${file}`);

    let commandName = file.split(".")[0];
    console.log(` ${prefix}${commandName} está operando corretamente.`);
    
    client.commands.set(commandName, props);
  });
});
client.on("message", (Message) => {
  if ( Message.channel.id != "779760356889198613" ) return;
  if ( Message.content.startsWith(">") ) return;

  Message.react("❤")
})
client.on("message", (Message) => {
  if ( Message.channel.id != "784227380108722236" ) return;
  if ( Message.content.startsWith(">") ) return;

  Message.react("<:sad_cat_thumbs_up:768291053765525525>")
})
client.on("message", (Message) => {
  if ( Message.channel.id != "784229832740700160" ) return;
  if ( Message.content.startsWith(">") ) return;

  Message.react("<:meowbughunter:776249240463736834>")
  Message.react("🤔")
})
client.on("message", async message => {
    
  if (message.author.bot) return;
  if (message.channel.dm === "dm") return;
  
let messageArray = message.content.split(" ");
let cmd = messageArray[0];
let args = messageArray.slice(1);

if (!message.content.startsWith(prefix)) return;
let commandfile = client.commands.get(cmd.slice(prefix.length));
if (commandfile) commandfile.run(client, message, args);
});

client.login(token);
