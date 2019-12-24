"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Stats_1 = require("../../structures/models/Stats");
class CommandFinishedListener extends discord_akairo_1.Listener {
    constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'commandFinished'
        });
    }
    async exec(message, command) {
        const gStats = await Stats_1.Stats.findOne({ id: '0' });
        const gUses = gStats.commands.get(command.id) || 0;
        gStats.commands.set(command.id, gUses + 1);
        gStats.save();
        if (message.guild) {
            const stats = await Stats_1.Stats.findOne({ id: message.guild.id });
            const uses = stats.commands.get(command.id) || 0;
            stats.commands.set(command.id, uses + 1);
            stats.save();
        }
    }
}
exports.default = CommandFinishedListener;
