package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor

class LaughExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val response = context.foxy.utils.getActionImage("laugh")

        context.reply {
            embed {
                description = context.locale["laugh.description", context.user.asMention]
                color = Colors.PURPLE
                image = response
            }
        }
    }
}