"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const emojis = __importStar(require("node-emoji"));
const Stats_1 = require("../../structures/models/Stats");
class MessageListener extends discord_akairo_1.Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
            category: 'client'
        });
    }
    async exec(message) {
        this.client.messageCounter++;
        if (!message.guild || message.author.bot)
            return;
        const emojiRegex = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/g;
        let emoji;
        let matches = message.content.match(emojiRegex);
        if (matches && matches.every(v => emojiRegex.test(v))) {
            emoji = message.guild.emojis.get(matches[1]);
            message.content.replace(emojiRegex, '');
        }
        else
            emoji = emojis.find(message.content);
        await Stats_1.Stats.updateOne({ id: '0' }, { $inc: { messages: 1 } });
        await Stats_1.Stats.updateOne({ id: message.guild.id }, { $inc: { messages: 1 } });
    }
}
exports.default = MessageListener;
