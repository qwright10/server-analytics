import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Message } from 'discord.js';
import { join } from 'path';
import { Logger } from '../structures/util/Logger';
import { SettingsProvider } from '../structures/providers/SettingsProvider';
import { StatsProvider } from '../structures/providers/StatsProvider';
import mongoose from 'mongoose';
require('dotenv').config();

declare module 'discord-akairo' {
    interface AkairoClient {
        commandHandler: CommandHandler,
        config: AnalyticsBotOptions,
        inhibitorHandler: InhibitorHandler,
        listenerHandler: ListenerHandler,
        logger: Logger,
        settings: SettingsProvider,
        stats: StatsProvider
    }
}

interface AnalyticsBotOptions {
    owner?: string
    token?: string
}

export class AnalyticsClient extends AkairoClient {
    public settings!: SettingsProvider;
    public stats!: StatsProvider;

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, '..', 'commands'),
        prefix: async (message: Message): Promise<string> => await this.settings.get(message.guild!, 'prefix', process.env.prefix),
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 3000,
        argumentDefaults: {
            prompt: {
                modifyStart: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
                modifyRetry: (_, str): string => `${str}\nType \`cancel\` to cancel the command.`,
                timeout: 'Error: Command timed out',
                ended: 'Error: Too many attemps',
                cancel: 'Command cancelled',
                retries: 3,
                time: 30000
            },
            otherwise: '',
        }
    });

    public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
        directory: join(__dirname, '..', 'inhibitors')
    });

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, '..', 'listeners')
    });

    public config: AnalyticsBotOptions;

    public logger: Logger;

    public constructor(config: AnalyticsBotOptions) {
        super({ ownerID: config.owner }, {
            messageCacheMaxSize: 1000,
            disableEveryone: true,
            shardCount: 2
        });

        this.config = config;

        this.logger = Logger;
    }

    private async _init(): Promise<void> {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });

        this.commandHandler.loadAll();
        this.logger.log(`Commands loaded: ${this.commandHandler.modules.size}`);
        this.inhibitorHandler.loadAll();
        this.logger.log(`Inhibitors loaded: ${this.inhibitorHandler.modules.size}`)
        this.listenerHandler.loadAll();
        this.logger.log(`Listeners loaded: ${this.listenerHandler.modules.size}`);

        this.settings = new SettingsProvider();
        await this.settings.init();
        this.logger.log('Settings provider initialized');

        this.stats = new StatsProvider();
        await this.stats.init();
        this.logger.log('Stats provider initialized');
        
        this.on('shardReady', (id: number) => this.logger.info(`Shard ${id} ready`));
        this.on('shardDisconnect', (_, id: number) => this.logger.error(`Shard ${id} disconnected`));
        this.on('shardError', (error: Error, id: number) => this.logger.error(`Shard ${id} error: ${error.stack}`));
    }

    public async start(): Promise<string> {
        try {
            await mongoose.connect(process.env.mongo as string, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });

            this.logger.log('MongoDB connected');
        } catch (e) {
            this.logger.error('Failed to connect to MongoDB');
            this.logger.error(e);
            return process.exit();
        }

        await this._init();
        return this.login(this.config.token);
    }
}