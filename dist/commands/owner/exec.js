"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const child_process_1 = __importDefault(require("child_process"));
class ExecCommand extends discord_akairo_1.Command {
    constructor() {
        super('exec', {
            aliases: ['e', 'exec'],
            description: {
                content: 'Evaluates code in a shell.',
                usage: '<code>'
            },
            category: 'owner',
            ownerOnly: true,
            ratelimit: 2,
            args: [
                {
                    id: 'code',
                    match: 'content'
                }
            ]
        });
    }
    async exec(message, { code }) {
        child_process_1.default.exec(code, async (error, stdout) => {
            let output = (error || stdout);
            output = discord_js_1.Util.splitMessage(`\`\`\`javascript\n${output}\`\`\``);
            for (const o of output)
                message.util.send(o);
        });
    }
}
exports.default = ExecCommand;
