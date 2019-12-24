"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class PingCommand extends discord_akairo_1.Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the latency to discord\'s servers.'
            },
            category: 'stats',
            ratelimit: 2
        });
    }
    async exec(message) {
        const e1 = new discord_js_1.MessageEmbed().setColor([255, 60, 60]).setDescription('Pinging...');
        const m = await message.util.send(e1);
        const embed = new discord_js_1.MessageEmbed()
            .setColor([255, 60, 60])
            .setDescription(`🏓 **${Math.round(this.client.ws.ping).toString()}**ms`);
        return m.edit(embed);
    }
}
exports.default = PingCommand;
