import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const NotStonksCommand = createCommand({
    name: "notstonks",
    description: "[🖼] - Crie uma imagem do not stonks",
    descriptionLocalizations: {
        "en-US": "[🖼] - Create an image of the not stonks"
    },
    category: "image",
    options: [
        {
            name: "text",
            nameLocalizations: {
                "pt-BR": "texto"    
            },
            description: "Texto que será exibido na imagem",
            descriptionLocalizations: {
                "en-US": "Text that will be displayed in the image"
            },
            type: ApplicationCommandOptionTypes.String,

        }
    ],
    execute: async (ctx, endCommand, t) => {
        const string = ctx.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/notstonks.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '40px sans-serif';
        context.fillStyle = '#000000';
        context.fillText(`${string}`, canvas.width / 13.1, canvas.height / 14.1);

        context.beginPath();
        context.arc(125, 125, 100, 6, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
        ctx.foxyReply({
            file: {
                name: "not_stonks.png",
                blob
            }
        }) 
        endCommand();
    }
});