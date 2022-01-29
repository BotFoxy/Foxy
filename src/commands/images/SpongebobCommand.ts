import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageAttachment } from "discord.js";
import * as Canvas from "canvas";

export default class SpongebobCommand extends Command {
    constructor(client) {
        super(client, {
            name: "spongebob",
            description: "Get spongebob fodase meme",
            category: "image",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("spongebob")
                .setDescription("[🖼 Image] Get spongebob fodase meme")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("The text you want to put on the spongebob meme"))
        });
    }

    async execute(interaction, t) {
        const content: string = interaction.options.getString("text");

        const canvas = Canvas.createCanvas(500, 400);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage('https://foxywebsite.xyz/api/memes/fodase.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${content}`, canvas.width / 15.5, canvas.height / 13.5);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const attachment = new MessageAttachment(canvas.toBuffer(), 'esponja.png');

        await interaction.editReply({ files: [attachment] });
    }
}