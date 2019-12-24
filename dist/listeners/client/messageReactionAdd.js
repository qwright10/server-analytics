"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const Stats_1 = require("../../structures/models/Stats");
const node_emoji_1 = __importDefault(require("node-emoji"));
class MessageReactionAddListener extends discord_akairo_1.Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }
    async exec(reaction, user) {
        const id = reaction.emoji.id || node_emoji_1.default.find(reaction.emoji.name);
        const gStats = await Stats_1.Stats.findOne({ id: '0' });
        reaction.message.channel.send(node_emoji_1.default.find(reaction.emoji.name).emoji);
    }
}
exports.default = MessageReactionAddListener;
