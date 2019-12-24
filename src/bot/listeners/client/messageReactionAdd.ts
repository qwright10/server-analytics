import { Listener } from 'discord-akairo';
import { GuildEmoji, MessageReaction, ReactionEmoji, User } from 'discord.js';
import { Stats } from '../../structures/models/Stats';
import emojis from 'node-emoji';

export default class MessageReactionAddListener extends Listener {
    public constructor() {
        super('messageReactionAdd', {
            emitter: 'client',
            category: 'client',
            event: 'messageReactionAdd'
        });
    }

    public async exec(reaction: MessageReaction, user: User): Promise<void> {
        const id = reaction.emoji.id || emojis.find(reaction.emoji.name);
        const gStats = await Stats.findOne({ id: '0' });
        reaction.message.channel.send(emojis.find(reaction.emoji.name).emoji)
    }
}