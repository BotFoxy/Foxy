
const Discord = require('discord.js')
const Canvas = require('canvas')
exports.run = async (client, message, args, applyText) => {

    const canvas = Canvas.createCanvas(700, 600);
    const ctx = canvas.getContext('2d');
  const sayMessage = args.join(' ');
<<<<<<< HEAD
    const background = await Canvas.loadImage('./src/assets/laranjo.jpeg');
=======
    const background = await Canvas.loadImage('./assets/images/laranjo.jpeg');
>>>>>>> fa1949703b749456bfd65b341678577697547e6d
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${sayMessage}`, canvas.width / 15.5, canvas.height / 13.5);

    // Add an exclamation point here and below

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'laranjo.png');

    message.channel.send(attachment);
     console.log(`User: ${message.author.tag} ID: ${message.author.id} disse "${sayMessage}" no servidor ${message.guild.name} ID: ${message.guild.id}`)
};