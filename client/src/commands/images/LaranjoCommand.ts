import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const LaranjoCommand = createCommand({
    name: "laranjo",
    description: "[🖼] - Crie uma imagem do laranjo",
    descriptionLocalizations: {
        "en-US": "[🖼] - Create an image of the laranjo"
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
            required: true
        }
    ],
    execute: async (ctx, endCommand, t) => {
        const string = ctx.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(700, 600);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/laranjo.png');
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '33px sans-serif';
        context.fillStyle = '#000000';
        context.fillText(`${string}`, canvas.width / 15.5, canvas.height / 13.5);

        context.beginPath();
        context.arc(125, 125, 100, 6, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const blob = new Blob([canvas.toBuffer()], { type: "image/png" });

        ctx.foxyReply({
            file: {
                name: "laranja_laranjo.png",
                blob
            }
        });
        endCommand();
    }
});

export default LaranjoCommand;