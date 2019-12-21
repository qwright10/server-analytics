import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class PingCommand extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'Gets the latency to discord\'s servers.'
            },
            category: 'stats',
            ratelimit: 2
        });
    }

    public async exec(message: Message): Promise<Message | Message[]> {
        let e1 = new MessageEmbed().setColor([155, 200, 200]).setDescription('Pinging...');
        const m = await message.util!.send(e1);
        const embed = new MessageEmbed()
            .setColor([155, 200, 200])
            .setDescription(`🏓 **${Math.round(this.client.ws.ping).toString()}**ms`);
        
        return m.edit(embed);
    }
}