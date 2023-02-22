import { InteractionResponseTypes, InteractionCallbackData, ApplicationCommandOptionTypes, } from 'discordeno';
import { Interaction, User } from 'discordeno/transformers';
import { TFunction } from 'i18next';

import { MessageFlags } from '../../utils/discord/Message';
import { bot } from "../../index";

import { getOptionFromInteraction } from './GetCommandOption';

export type CanResolve = 'users' | 'members' | false;

export default class {
    public replied = false;
    public subCommand: string | undefined;
    public subCommandGround: string | undefined;

    constructor(
        public interaction: Interaction,
        public i18n: TFunction,
    ) {
        let options = interaction.data?.options ?? [];

        if (options[0]?.type === ApplicationCommandOptionTypes.SubCommandGroup) {
            this.subCommandGround = options[0].name;
            options = options[0].options ?? [];
        }

        if (options[0]?.type === ApplicationCommandOptionTypes.SubCommand) {
            this.subCommand = options[0].name;
        }
    }

    get author(): User {
        return this.interaction.user;
    }

    get commandId(): bigint {
        return this.interaction.data?.id ?? 0n;
    }

    get channelId(): bigint {
        return this.interaction.channelId ?? 0n;
    }

    makeReply(emoji: any, text: string): string {
        return `${emoji || '🐛'} **|** ${text}`;
    }

    async followUp(options: InteractionCallbackData): Promise<void> {
        await bot.helpers.sendFollowupMessage(this.interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: options,
        })
    }

    async sendReply(options: InteractionCallbackData & { attachments?: unknown[] }): Promise<void> {
        if (!bot.isProduction) {
            bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `${bot.emotes.waiting} **|** Você está usando a versão experimental da Foxy! Coisas inesperadas podem acontecer, como: algumas ou todas as funcionalidades podem não funcionar, eu posso ficar offline a qualquer momento, não reporte problemas da versão experimental a não ser que seja solicitado pela staff do servidor!`,
                    flags: 64
                }
            });
            await bot.helpers.sendFollowupMessage(this.interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: options,
            });
            return;
        }
        if (this.replied) {
            await bot.helpers
                .editOriginalInteractionResponse(this.interaction.token, options)
            return;
        }

        this.replied = true;

        await bot.helpers.sendInteractionResponse(this.interaction.id, this.interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: options,
        })
    }

    getSubCommandGroup(required = false): string {
        const command = this.subCommandGround;

        if (!command && required)
            throw new Error(`SubCommandGroup is required in ${this.interaction.data?.name}`);

        return command as string;
    }

    getSubCommand(): string {
        const command = this.subCommand;

        if (!command) throw new Error(`SubCommand is required in ${this.interaction.data?.name}`);

        return command as string;
    }

    getOption<T>(name: string, shouldResolve: CanResolve, required: true): T;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: false): T | undefined;

    getOption<T>(name: string, shouldResolve: CanResolve, required?: boolean): T | undefined {
        return getOptionFromInteraction<T>(this.interaction, name, shouldResolve, required);
    }

    async defer(Ephemeral = false): Promise<void> {
        this.replied = true;
        await bot.helpers
            .sendInteractionResponse(this.interaction.id, this.interaction.token, {
                type: InteractionResponseTypes.DeferredChannelMessageWithSource,
                data: {
                    flags: Ephemeral ? MessageFlags.Ephemeral : undefined,
                },
            })
    }

    locale(text: string, options: Record<string, unknown> = {}): string {
        return this.i18n(text, options);
    }
}