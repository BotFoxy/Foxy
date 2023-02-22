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
    execute: async (context, endCommand, t) => {
        const selectedOption = context.getOption<string>('layout', false, true);
        const layouts = lylist.map(data => data.id);
        if (!layouts.includes(selectedOption)) return context.sendReply({
            content: context.makeReply(bot.emotes.error, t('commands:layouts.notFound'))
        });
        const userData = await bot.database.getUser(context.author.id);
        userData.layout = selectedOption;
        await userData.save();
        context.sendReply({
            content: context.makeReply(bot.emotes.success, t('commands:layouts.changed'))
        })
        endCommand();
    }
});

export default LayoutCommand;