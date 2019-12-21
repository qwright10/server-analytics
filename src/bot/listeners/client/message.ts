import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import * as emojis from 'node-emoji';
import { Stats } from '../../structures/models/Stats';

export default class MessageListener extends Listener {
    public constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
            category: 'client'
        });
    }

    public async exec(message: Message) {
        if (!message.guild || message.author.bot) return;

        const emojiRegex = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/;
        let emoji;

        await Stats.updateOne({ id: '0' }, { $inc: { messages: 1 }});
        await Stats.updateOne({ id: message.guild!.id }, { $inc: { messages: 1 }});
        
        if (emojiRegex.test(message.content)) [, message.content] = emojiRegex.exec(message.content)!;
        if (!isNaN((message.content as unknown) as number)) emoji = message.guild!.emojis.get(message.content);
        else emoji = message.guild!.emojis.find(e => e.name === message.content) || emojis.find(message.content);
    }
}