"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class ReadyListener extends discord_akairo_1.Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            category: 'client',
            event: 'ready'
        });
    }
    async exec() {
        this.client.logger.log(`Logged in as ${this.client.user.tag}`);
        this.client.user.setPresence({ activity: {
                name: 'over you', type: 'WATCHING'
            }, status: 'dnd' });
    }
}
exports.default = ReadyListener;
