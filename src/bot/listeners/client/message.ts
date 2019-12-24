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
        this.client.messageCounter++;
        if (!message.guild || message.author.bot) return;
        const emojiRegex = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/g;
        let emoji;
        const matches = message.content.match(emojiRegex);

        if (matches && matches.every(v => emojiRegex.test(v))) {
            emoji = message.guild!.emojis.get(matches[1]);
            message.content.replace(emojiRegex, '');
        } else emoji = emojis.find(message.content);

        await Stats.updateOne({ id: '0' }, { $inc: { messages: 1 }});
        await Stats.updateOne({ id: message.guild!.id }, { $inc: { messages: 1 }});
    }
}