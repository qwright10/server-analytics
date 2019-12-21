"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class BlacklistInhibitor extends discord_akairo_1.Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        });
    }
    async exec(message) {
        const blacklist = await this.client.settings.get('0', 'blacklist', []);
        return blacklist.includes(message.author.id);
    }
}
exports.default = BlacklistInhibitor;
