"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Stats_1 = require("../../structures/models/Stats");
class InfoCommand extends discord_akairo_1.Command {
    constructor() {
        super('info', {
            aliases: ['info'],
            description: {
                content: 'Returns guild or global statistics',
                usage: '<method>'
            },
            category: 'stats',
            channel: 'guild',
            ratelimit: 2,
            args: [
                {
                    id: 'type',
                    type: 'lowercase'
                }
            ]
        });
    }
    async exec(message, { type }) {
        if (type === 'global') {
            let stats = await Stats_1.Stats.findOne({ id: '0' }).lean();
            let embed = new discord_js_1.MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Global Statistics**')
                .addField('Total Messages', stats.messages, true)
                .setFooter('Global Stats')
                .setTimestamp(Date.now());
            return message.util.send(embed);
        }
        else if (type === 'guild') {
            let stats = await Stats_1.Stats.findOne({ id: message.guild.id }).lean();
            let embed = new discord_js_1.MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Guild Statistics**')
                .addField('Total Messages', stats.messages, true)
                .setFooter('Global Stats')
                .setTimestamp(Date.now());
            return message.util.send(embed);
        }
        else {
            return message.util.send('Use `global` or `guild` to get statistics');
        }
    }
}
exports.default = InfoCommand;
