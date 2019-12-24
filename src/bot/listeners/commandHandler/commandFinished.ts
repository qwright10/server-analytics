import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { Stats } from '../../structures/models/Stats';

export default class CommandFinishedListener extends Listener {
    public constructor() {
        super('commandFinished', {
            emitter: 'commandHandler',
            category: 'commandHandler',
            event: 'commandFinished'
        });
    }

    public async exec(message: Message, command: Command): Promise<void> {
        const gStats = await Stats.findOne({ id: '0' });
        const gUses = gStats!.commands.get(command.id) || 0;
        gStats!.commands.set(command.id, gUses + 1);
        gStats!.save();

        if (message.guild) {
            const stats = await Stats.findOne({ id: message.guild.id });
            const uses = stats!.commands.get(command.id) || 0;
            stats!.commands.set(command.id, uses + 1);
            stats!.save();
        }
    }
}