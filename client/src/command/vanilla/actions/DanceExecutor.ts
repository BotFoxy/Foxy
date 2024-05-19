import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function DanceExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});
    const danceGif: any = await context.getImage("dance");

    embed.title = t('commands:dance.dancing', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: danceGif.url
        }

    context.sendReply({
        embeds: [embed],
    })
    endCommand();
}
