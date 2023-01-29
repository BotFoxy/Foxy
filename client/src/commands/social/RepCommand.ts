import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from 'discordeno/types'
import { User } from "discordeno/transformers";
import { bot } from "../../index";
import ms from "ms";

const RepCommand = createCommand({
    path: '',
    name: "rep",
    description: "Dê reputação para um usuário",
    descriptionLocalizations: {
        "en-US": "Give reputation to a user"
    },
    category: "social",
    options: [
        {
            name: "user",
            description: "O usuário que você quer dar reputação",
            descriptionLocalizations: {
                "en-US": "The user you want to give reputation"
            },
            type: ApplicationCommandOptionTypes.User
        }
    ],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');
        if (!user) {
            ctx.prettyReply(bot.emotes.error, t('commands:global.noUser'));
            return finishCommand();
        }

        if (user.id === ctx.author.id) {
            ctx.prettyReply("🚫", t('commands:rep.self'));
            return finishCommand();
        }

        const userData = await bot.database.getUser(user.id);
        const authorData = await bot.database.getUser(ctx.author.id);
        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            return ctx.prettyReply(bot.emotes.error, t('commands:rep.cooldown', { cooldown: currentCooldown }))
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            authorData.save();
            userData.save();
            return ctx.prettyReply(bot.emotes.success, t('commands:rep.success', { user: user.username }))
        }
    }
});

export default RepCommand;