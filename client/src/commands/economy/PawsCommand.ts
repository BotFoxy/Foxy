import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import PawsTransferExecutor from "../../utils/commands/executors/PawsTransferExecutor";

const PawsCommand = createCommand({
name: 'paws',
    description: 'Veja suas paws',
    descriptionLocalizations: {
        'en-US': 'See your paws'
    },
    options: [
        {
            name: "atm",
            description: "[💵] Veja a sua quantidade de paws",
            descriptionLocalizations: {
                'en-US': "[💵] See your amount of paws"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "Veja a quantidade de paws de outro usuário",
                    descriptionLocalizations: {
                        'en-US': "See the amount of paws of another user"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: false
                }
            ]
        },
        {
            name: "transfer",
            nameLocalizations: {
                'pt-BR': "transferir"
            },
            description: "[💵] Envie paws para outra pessoa",
            descriptionLocalizations: {
                'en-US': "[💵] Transfer paws to another person"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "Usuário que você quer transferir",
                    descriptionLocalizations: {
                        'en-US': "User you want to transfer"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "amount",
                    nameLocalizations: {
                        'pt-BR': "quantidade"
                    },
                    description: "Quantidade de paws que você quer transferir",
                    descriptionLocalizations: {
                        'en-US': "Amount of paws you want to transfer"
                    },
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                    minValue: 1
                }
            ]
        }
    ],
    commandRelatedExecutions: [PawsTransferExecutor],
    category: 'economy',
    execute: async (context, endCommand, t) => {
        switch (context.getSubCommand()) {
            case "atm": {
                const user = await context.getOption<User>('user', 'users') ?? context.author;
                if (!user) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                    });
                    return endCommand();
                }
                const userData = await bot.database.getUser(user.id);
                const balance = userData.balance;

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', { user: user.username, balance: balance.toString() }))
                })
                endCommand();
                break;
            }
            case "transfer": {
                const user = await context.getOption<User>('user', 'users');
                const amount = await context.getOption<number>('amount', false);
                if (!user) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                    });
                    return endCommand();
                }

                const authorData = await bot.database.getUser(context.author.id);
                const coins = amount;

                const value = Math.round(coins);

                if (user === context.author) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.self'))
                    })
                    return endCommand();
                }
                if (value > authorData.balance) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.notEnough'))
                    })
                    return endCommand();
                }


                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:pay.alert', { amount: value.toString(), user: user.username })),
                    components: [createActionRow([createButton({
                        label: t('commands:pay.pay'),
                        style: ButtonStyles.Success,
                        customId: createCustomId(0, context.author.id, context.commandId, value, user.id)
                    })])]
                });
                endCommand();
                break;
            }
        }
    }
});

export default PawsCommand;