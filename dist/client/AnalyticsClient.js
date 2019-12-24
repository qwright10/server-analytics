"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const path_1 = require("path");
const Logger_1 = require("../structures/util/Logger");
const SettingsProvider_1 = require("../structures/providers/SettingsProvider");
const StatsProvider_1 = require("../structures/providers/StatsProvider");
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
class AnalyticsClient extends discord_akairo_1.AkairoClient {
    constructor(config) {
        super({ ownerID: [config.owner, '196214245770133504'] }, {
            partials: ['MESSAGE'],
            messageCacheMaxSize: 1000,
            disableEveryone: true,
            shardCount: 2
        });
        this.commandHandler = new discord_akairo_1.CommandHandler(this, {
            directory: path_1.join(__dirname, '..', 'commands'),
            prefix: async (message) => await this.settings.get(message.guild, 'prefix', process.env.prefix),
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 3e5,
            defaultCooldown: 3000,
            argumentDefaults: {
                prompt: {
                    modifyStart: (_, str) => `${str}\nType \`cancel\` to cancel the command.`,
                    modifyRetry: (_, str) => `${str}\nType \`cancel\` to cancel the command.`,
                    timeout: 'Error: Command timed out',
                    ended: 'Error: Too many attemps',
                    cancel: 'Command cancelled',
                    retries: 3,
                    time: 30000
                },
                otherwise: '',
            }
        });
        this.inhibitorHandler = new discord_akairo_1.InhibitorHandler(this, {
            directory: path_1.join(__dirname, '..', 'inhibitors')
        });
        this.listenerHandler = new discord_akairo_1.ListenerHandler(this, {
            directory: path_1.join(__dirname, '..', 'listeners')
        });
        this.messageCounter = 0;
        this.messagesPerSecond = 0.0;
        this.config = config;
        this.logger = Logger_1.Logger;
        this.constants = {
            colors: {
                info: [255, 60, 60]
            }
        };
        this.delete = async (message, m, timeout = 5000) => {
            if (message.deletable && !message.deleted)
                message.delete({ timeout });
            if (m.deletable && !m.deleted)
                m.delete({ timeout });
        };
    }
    async _init() {
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
        this.logger.log(`Inhibitors loaded: ${this.inhibitorHandler.modules.size}`);
        this.listenerHandler.loadAll();
        this.logger.log(`Listeners loaded: ${this.listenerHandler.modules.size}`);
        this.settings = new SettingsProvider_1.SettingsProvider();
        await this.settings.init();
        this.logger.log('Settings provider initialized');
        this.stats = new StatsProvider_1.StatsProvider();
        await this.stats.init();
        this.logger.log('Stats provider initialized');
        this.on('shardReady', (id) => this.logger.info(`Shard ${id} ready`));
        this.on('shardDisconnect', (_, id) => this.logger.error(`Shard ${id} disconnected`));
        this.on('shardError', (error, id) => this.logger.error(`Shard ${id} error: ${error.stack}`));
        this.setInterval(() => {
            this.messagesPerSecond = this.messageCounter / 15;
            this.messageCounter = 0;
        }, 15000);
    }
    async start() {
        try {
            await mongoose_1.default.connect(process.env.mongo, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
            this.logger.log('MongoDB connected');
        }
        catch (e) {
            this.logger.error('Failed to connect to MongoDB');
            this.logger.error(e);
            return process.exit();
        }
        await this._init();
        return this.login(this.config.token);
    }
}
exports.AnalyticsClient = AnalyticsClient;
