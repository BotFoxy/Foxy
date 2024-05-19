import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function LaughExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});

    const laughGif: any = await context.getImage("laugh");
    embed.title = t('commands:laugh.success', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: laughGif.url
        }

    context.sendReply({
        embeds: [embed],
    })
    endCommand();
}