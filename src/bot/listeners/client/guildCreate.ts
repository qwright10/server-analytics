import { Listener } from 'discord-akairo';
import { Guild, MessageEmbed, Message } from 'discord.js'
import { Settings } from '../../structures/models/Settings';
import { Stats } from '../../structures/models/Stats';

export default class GuildCreateListener extends Listener {
    public constructor() {
        super('guildCreate', {
            emitter: 'client',
            category: 'client',
            event: 'guildCreate'
        });
    }

    public async exec(guild: Guild): Promise<void> {
        if (this.client.settings.items.has(guild.id)) {
            await this.client.settings.clear(guild);
            await Settings.deleteOne({ guild: guild.id });
        }

        await Settings.create({
            id: guild.id,
            name: guild.name,
            prefix: process.env.prefix,
            blacklist: []
        }, async (err: any): Promise<Message> => {
            if (err) this.client.logger.error(`Settings for ${guild.name} (${guild.id}) - ${guild.owner!.user.tag} couldn't be created`);
            const embed = new MessageEmbed()
                .setColor([155, 200, 200])
                .setAuthor(this.client.user!.tag, this.client.user!.displayAvatarURL())
                .setDescription('Something went wrong. Try kicking and re-adding me.')
                .setTimestamp(Date.now());

            return guild.owner!.send(embed);
        });

        await Stats.create({
            id: guild.id,
            name: guild.name,
            emojis: {},
            messages: 0
        }, async (err: any): Promise<void> => {
            if (err) this.client.logger.error(`Stats for ${guild.name} (${guild.id}) - ${guild.owner!.user.tag} couldn't be created`);
        });
    }
}