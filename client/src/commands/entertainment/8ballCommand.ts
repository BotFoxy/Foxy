import { createCommand} from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from "../../index";

const eightBallCommand = createCommand({
name: '8ball',
    description: '[Entretenimento] Pergunte algo para a Foxy',
    descriptionLocalizations: {
        'en-US': '[Entertainment] Ask something to Foxy'
    },
    category: 'games',
    options: [
        {
            name: 'question',
            nameLocalizations: {
                'pt-BR': 'pergunta'
            },
            description: 'Pergunta que você quer fazer',
            descriptionLocalizations: {
                'en-US': 'Question you want to ask'
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        const results = [
            t('commands:8ball.yes'),
            t('commands:8ball.no'),
            t('commands:8ball.maybe'),
            t('commands:8ball.idk'),
            t('commands:8ball.idk2'),
            t('commands:8ball.probablyyes'),
            t('commands:8ball.probablyno'),
            t('commands:8ball.probably')
        ];

        const result = results[Math.floor(Math.random() * results.length)];

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, result)
        });
        endCommand();
    }
});

export default eightBallCommand;