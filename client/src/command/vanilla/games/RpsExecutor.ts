import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { ButtonStyles } from "discordeno/types";
import { bot } from '../../../index';
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { createEmbed } from "../../../utils/discord/Embed";

export default async function RpsExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const embed = createEmbed({
        description: t('commands:rps.start'),
        fields: [{
            name: await bot.foxyRest.getUserDisplayName(context.author.id),
            value: t('commands:rps.defaultValue'),
            inline: true
        },
        {
            name: "Foxy",
            value: t('commands:rps.defaultValue'),
            inline: true
        }]
    });

    context.sendReply({
        embeds: [embed],
        components: [createActionRow([createButton({
            label: bot.locale('commands:rps.button.rock'),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, "rock"),
            emoji: {
                id: bot.emotes.ROCK
            }
        }), createButton({
            label: bot.locale('commands:rps.button.paper'),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, "paper"),
            emoji: {
                name: "📄"
            }
        }), createButton({
            label: bot.locale('commands:rps.button.scissors'),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, "scissors"),
            emoji: {
                name: "✂"
            }
        }), createButton({
            label: bot.locale('commands:rps.button.cancel'),
            style: ButtonStyles.Danger,
            customId: createCustomId(0, context.author.id, context.commandId, "cancel"),
            emoji: {
                id: bot.emotes.FOXY_CRY
            }
        })])]
    });

    endCommand();
}