module.exports = class ShardReconnecting {
    constructor(client) {
        this.client = client;
    }

 async run(shard) {
     console.info(`Shard ${shard} está tentando se reconectar ao Discord`);
 }
}