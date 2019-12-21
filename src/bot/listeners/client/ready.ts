import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            category: 'client',
            event: 'ready'
        });
    }

    public async exec(): Promise<void> {
        this.client.logger.log(`Logged in as ${this.client.user!.tag}`);
        this.client.user!.setPresence({ activity: {
            name: 'over you', type: 'WATCHING'
        }, status: 'dnd' });
    }
}