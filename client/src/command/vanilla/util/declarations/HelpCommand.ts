import { bot } from '../../../../index';
import { createCommand } from '../../../structures/createCommand';
import { createEmbed } from '../../../../utils/discord/Embed';

const HelpCommand = createCommand({
    name: 'help',
    nameLocalizations: {
        "pt-BR": "ajuda"
    },
    description: '[Utils] Shows the help message',
    descriptionLocalizations: {
        "pt-BR": '[Utilitários] Mostra a mensagem de ajuda'
    },
    category: 'util',
    execute: async (context, endCommand, t) => {
        
    }
});

export default HelpCommand;