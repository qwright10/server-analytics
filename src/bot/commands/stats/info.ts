import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import { Stats } from '../../structures/models/Stats';

export default class InfoCommand extends Command {
    public constructor() {
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

    public async exec(message: Message, { type }: { type: string }): Promise<Message | Message[]> {
        if (type === 'global') {
            let stats = await Stats.findOne({ id: '0' }).lean();
            let embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Global Statistics**')
                .addField('Total Messages', stats!.messages, true)
                .setFooter('Global Stats')
                .setTimestamp(Date.now())

            return message.util!.send(embed);
        } else if (type === 'guild') {
            let stats = await Stats.findOne({ id: message.guild!.id }).lean();
            let embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .setTitle('**Guild Statistics**')
                .addField('Total Messages', stats!.messages, true)
                .setFooter('Global Stats')
                .setTimestamp(Date.now())

            return message.util!.send(embed);
        } else {
            return message.util!.send('Use `global` or `guild` to get statistics');
        }
    }
}