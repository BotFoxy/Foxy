import { ShardState } from "discordeno/gateway";
import { logger } from "../../../../../common/utils/logger";
import { bot } from "../../FoxyLauncher";

const onShardDisconnect = async (): Promise<void> => {
    bot.gateway.manager.createShardOptions.events.disconnected = async (shard) => {
        setTimeout(async () => {
            if (shard.state !== ShardState.Connected) {
                logger.error(`[SHARD] Shard #${shard.id} disconnected! | Shard state: ${ShardState[shard.state]}`);
            }
            try {
                switch (shard.state) {
                    case ShardState.Disconnected:
                    case ShardState.Offline:
                        logger.info(`[SHARD] Shard #${shard.id} is ${shard.state}. Attempting to connect...`);
                        logger.onShardReconnect(shard);
                        await shard.connect();
                        break;

                    case ShardState.Unidentified:
                        logger.info(`[SHARD] Shard #${shard.id} is Unidentified. Attempting to identify...`);
                        logger.onShardReconnect(shard);
                        await bot.gateway.manager.requestIdentify(shard.id);
                        break;

                    case ShardState.Identifying:
                        logger.info(`[SHARD] Shard #${shard.id} is Identifying. Attempting to resume...`);
                        logger.onShardReconnect(shard);
                        await shard.resume();
                        break;

                    case ShardState.Resuming:
                        logger.info(`[SHARD] Shard #${shard.id} is Resuming. No action taken.`);
                        logger.onShardReconnect(shard);
                        break;

                    case ShardState.Connected:
                        // Ignore "Connected" state, i don't know why it's being called here.
                    break;

                    default:
                        logger.warn(`[SHARD] Shard #${shard.id} is in an unknown state. Attempting to resume...`);
                        logger.onShardReconnect(shard);
                        await shard.resume();
                        break;
                }

            } catch (error) {
                logger.error(`[SHARD] Failed to reconnect shard #${shard.id}.`, error);
            }
        }, 10000);
    };
};

export { onShardDisconnect };
