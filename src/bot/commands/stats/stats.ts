import { Command } from 'discord-akairo';
import { Message, MessageEmbed, User } from 'discord.js';
import moment from 'moment';
import 'moment-duration-format';
import os from 'os';
import { stripIndents } from 'common-tags';

export default class StatsCommand extends Command {
    public constructor() {
        super('stats', {
            aliases: ['stats'],
            description: {
                content: 'Provides stats about Server Analytics.'
            },
            category: 'info',
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        let owners: User[] = [];
        for (const id of this.client.ownerID) owners.push(await this.client.users.fetch(id));

        const embed = new MessageEmbed()
            .setColor([255, 60, 60])
            .setDescription(`${this.client.user!.username} Statistics`)
            .addField('> Info', stripIndents`\`\`\`js
                Users: ${this.client.guilds.reduce((p, c) => p + c.memberCount, 0).toLocaleString()}
                Guilds: ${this.client.guilds.size.toLocaleString()}
                Channels: ${this.client.channels.size.toLocaleString()}
                Shards: ${this.client.ws.shards.size.toLocaleString()}
                Uptime: ${moment.duration(this.client.uptime || 0).format('D[d]:H[h]:m[m]:s[s]')}
                Messages/second: ${this.client.messagesPerSecond.toFixed(2)}
            \`\`\``)
            .addField('> System', stripIndents`\`\`\`js
                CPU: ${os.cpus().length}-core ${os.cpus()[0].model}
                Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB
                OS: ${os.platform}
            \`\`\``)
            .setFooter(`Made by ${owners.map(u => u.tag).join(' and ')}`)
            .setTimestamp(Date.now());

        return message.util!.send(embed);
    }
}