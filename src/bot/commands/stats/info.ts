import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { Stats } from '../../structures/models/Stats';
import { stripIndents } from 'common-tags';

export default class InfoCommand extends Command {
    public constructor() {
        super('info', {
            aliases: ['info'],
            description: {
                content: 'Returns guild or global statistics',
                usage: '<method>'
            },
            category: 'stats',
            ratelimit: 2,
            args: [
                {
                    id: 'type',
                    type: 'lowercase'
                }
            ]
        });
    }

    public async exec(message: Message, { type }: { type: string }): Promise<Message | Message[] | void> {
        const capitalize = (str: string): string => str.split('').map((v, i) => i === 0 ? v.toUpperCase() : v.toLowerCase()).join('');
        if (type === 'global') {
            const stats = await Stats.findOne({ id: '0' });
            const most = [...stats!.commands.entries()].sort((a, b) => b[1] - a[1])[0];
            const total = [...stats!.commands.values()].reduce((p, c) => p + c, 0);
            const embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Global Statistics**')
                .setDescription(stripIndents`\`\`\`js
                    Total Messages: ${stats!.messages}
                    Total Command Usage: ${total}
                    Most Used Command: ${capitalize(most[0])} with ${most[1]} uses
                \`\`\``)
                .setTimestamp(Date.now())
            return message.util!.send(embed);
        } else if (type === 'guild') {
            if (!message.guild) return message.util!.send('This can only be used in a guild.').then(m => this.client.delete(message, m, 3000));
            const stats = await Stats.findOne({ id: message.guild!.id });
            let most = [...stats!.commands.entries()].sort((a, b) => b[1] - a[1])[0];
            const total = [...stats!.commands.values()].reduce((p, c) => p + c, 0);
            const embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Guild Statistics**')
                .setDescription(stripIndents`\`\`\`js
                    Total Messages: ${stats!.messages}
                    Total Command Usage: ${total}
                    Most Used Command: ${capitalize(most[0])} with ${most[1]} uses
                \`\`\``)
                .setFooter('Guild Stats')
                .setTimestamp(Date.now())

            return message.util!.send(embed);
        } else {
            return message.util!.send('Use `global` or `guild` to get statistics');
        }
    }
}