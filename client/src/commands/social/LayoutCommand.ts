import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";
import { lylist } from '../../structures/json/layoutList.json';

const choices = lylist.map(data => Object({ name: data.name, value: data.id }));
const LayoutCommand = createCommand({
    name: "layout",
    description: "[👥] Mude o layout do seu perfil",
    descriptionLocalizations: {
        "en-US": "[👥] Change your profile layout"
    },
    category: "economy",
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[👥] Defina o layout do seu perfil",
            descriptionLocalizations: {
                "en-US": "[👥] Set your profile layout"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "layout",
                    nameLocalizations: {
                        "pt-BR": "layout"
                    },
                    description: "Escolha o layout do seu perfil",
                    descriptionLocalizations: {
                        "en-US": "Choose your profile layout"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    choices: choices,
                    required: true
                }
            ]
        }
    ],
    execute: async (ctx, endCommand, t) => {
        const selectedOption = ctx.getOption<string>('layout', false, true);
        const layouts = lylist.map(data => data.id);
        if (!layouts.includes(selectedOption)) return ctx.foxyReply({
            content: ctx.makeReply(bot.emotes.error, t('commands:layouts.notFound'))
        });
        const userData = await bot.database.getUser(ctx.author.id);
        userData.layout = selectedOption;
        await userData.save();
        ctx.foxyReply({
            content: ctx.makeReply(bot.emotes.success, t('commands:layouts.changed'))
        })
        endCommand();
    }
});

export default LayoutCommand;