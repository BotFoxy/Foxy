import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
const scraper = require('mal-scraper');

const AnimeCommand = createCommand({
    path: '',
    name: "anime",
    description: "Pesquisa a informação de algum anime",
    descriptionLocalizations: {
        "en-US": "Searches for information about an anime"
    },
    category: "util",
    options: [
        {
            name: 'anime',
            type: ApplicationCommandOptionTypes.String,
            description: 'Nome do anime que você quer pesquisar',
            descriptionLocalizations: { 'en-US': 'Name of the anime you want to search' },
        }
    ],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const anime = ctx.getOption<string>('anime', false);

        scraper.getInfoFromName(anime).then((data) => {
            if (!data) return ctx.prettyReply("🚫", t('commands:anime.notFound'));

            const embed = createEmbed({
                title: data.title,
                url: data.url,
                thumbnail: { url: data.picture },
                description: data.synopsis,
                fields: [
                    { name: t("commands:anime.info.status"), value: data.status || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.episodes"), value: data.episodes || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.score"), value: data.score || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.type"), value: data.type || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.aired"), value: data.aired || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.premiered"), value: data.premiered || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.studios"), value: data.studios || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.genres"), value: data.genres || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.duration"), value: data.duration || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.rating"), value: data.rating || t("commands:anime.nothing"), inline: true},
                    { name: t("commands:anime.info.broadcast"), value: data.broadcast || t("commands:anime.nothing"), inline: true},
                    { name: "Trailer", value: `[${t('anime.click')}](${data.trailer})` || t("commands:anime.nothing"), inline: true},
                ]
            });

            ctx.foxyReply({ embeds: [embed] });
            finishCommand();
        });
    }
});

export default AnimeCommand;