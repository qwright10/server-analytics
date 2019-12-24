import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import childProcess from 'child_process';

export default class ExecCommand extends Command {
    public constructor() {
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

    public async exec(message: Message, { code }: { code: string }): Promise<void> {
        childProcess.exec(code, async (error, stdout): Promise<void> => {
            let output = (error || stdout) as string | string[];
            output = Util.splitMessage(`\`\`\`javascript\n${output}\`\`\``);
            for (const o of output) message.util!.send(o);
        });
    }
}