"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const Stats_1 = require("../models/Stats");
class StatsProvider extends discord_akairo_1.Provider {
    constructor() {
        super();
        this.model = Stats_1.Stats;
    }
    async init() {
        const statsDocs = await Stats_1.Stats.find();
        for (const stat of statsDocs) {
            this.items.set(stat.id, stat);
        }
    }
    async get(guild, key, defaultValue) {
        const id = this.getGuildId(guild);
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value === undefined ? defaultValue : value;
        }
        return defaultValue;
    }
    async set(guild, key, value) {
        const id = this.getGuildId(guild);
        const data = this.items.get(id) || {};
        data[key] = value;
        this.items.set(id, data);
        return await Stats_1.Stats.updateOne({ id }, { [key]: value });
    }
    async delete(guild, key) {
        const id = this.getGuildId(guild);
        const data = this.items.get(id) || {};
        delete data[key];
        return await Stats_1.Stats.updateOne({ id }, { [key]: null });
    }
    async clear(guild) {
        const id = this.getGuildId(guild);
        this.items.delete(id);
        return await Stats_1.Stats.deleteOne({ id });
    }
    getGuildId(guild) {
        if (guild instanceof discord_js_1.Guild)
            return guild.id;
        if (guild === 'global' || guild === null)
            return '0';
        if (typeof guild === 'string' && /^\d+$/.test(guild))
            return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
}
exports.StatsProvider = StatsProvider;
