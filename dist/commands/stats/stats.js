"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
require("moment-duration-format");
const os_1 = __importDefault(require("os"));
const common_tags_1 = require("common-tags");
class StatsCommand extends discord_akairo_1.Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            description: {
                content: 'Provides stats about Server Analytics.'
            },
            category: 'info',
            ratelimit: 2
        });
    }
    async exec(message) {
        let owners = [];
        for (const id of this.client.ownerID)
            owners.push(await this.client.users.fetch(id));
        const embed = new discord_js_1.MessageEmbed()
            .setColor([255, 60, 60])
            .setDescription(`${this.client.user.username} Statistics`)
            .addField('> Info', common_tags_1.stripIndents `\`\`\`js
                Users: ${this.client.guilds.reduce((p, c) => p + c.memberCount, 0).toLocaleString()}
                Guilds: ${this.client.guilds.size.toLocaleString()}
                Channels: ${this.client.channels.size.toLocaleString()}
                Shards: ${this.client.ws.shards.size.toLocaleString()}
                Uptime: ${moment_1.default.duration(this.client.uptime || 0).format('D[d]:H[h]:m[m]:s[s]')}
                Messages/second: ${this.client.messagesPerSecond.toFixed(2)}
            \`\`\``)
            .addField('> System', common_tags_1.stripIndents `\`\`\`js
                CPU: ${os_1.default.cpus().length}-core ${os_1.default.cpus()[0].model}
                Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os_1.default.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB
                OS: ${os_1.default.platform}
            \`\`\``)
            .setFooter(`Made by ${owners.map(u => u.tag).join(' and ')}`)
            .setTimestamp(Date.now());
        return message.util.send(embed);
    }
}
exports.default = StatsCommand;
