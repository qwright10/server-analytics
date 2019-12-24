"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Settings_1 = require("../../structures/models/Settings");
const Stats_1 = require("../../structures/models/Stats");
class GuildCreateListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            category: 'client',
            event: 'guildCreate'
        });
    }
    async exec(guild) {
        if (this.client.settings.items.has(guild.id)) {
            await this.client.settings.clear(guild);
            await Settings_1.Settings.deleteOne({ guild: guild.id });
        }
        if ((await Stats_1.Stats.count({ id: guild.id })) > 1) {
            await Stats_1.Stats.deleteOne({ id: guild.id });
        }
        await Settings_1.Settings.create({
            id: guild.id,
            name: guild.name,
            prefix: process.env.prefix,
            blacklist: []
        }, async (err) => {
            if (err) {
                this.client.logger.error(`Settings for ${guild.name} (${guild.id}) - ${guild.owner.user.tag} couldn't be created`);
                const embed = new discord_js_1.MessageEmbed()
                    .setColor([155, 200, 200])
                    .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
                    .setDescription('Something went wrong. Try kicking and re-adding me.')
                    .setTimestamp(Date.now());
                const owner = await this.client.users.fetch(guild.ownerID);
                return owner.send(embed);
            }
        });
        await Stats_1.Stats.create({
            id: guild.id,
            name: guild.name,
            emojis: {},
            commands: {},
            reactions: {},
            messages: 0
        }, async (err) => {
            if (err)
                this.client.logger.error(`Stats for ${guild.name} (${guild.id}) - ${guild.owner.user.tag} couldn't be created ${err}`);
        });
    }
}
exports.default = GuildCreateListener;
