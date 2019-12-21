import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor {
    public constructor() {
        super('blacklist', {
            reason: 'blacklist'
        });
    }

    public async exec(message: Message): Promise<boolean> {
        const blacklist: Array<string> = await this.client.settings.get('0', 'blacklist', []);
        return blacklist.includes(message.author!.id);
    }
}