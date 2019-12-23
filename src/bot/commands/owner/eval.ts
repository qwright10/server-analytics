import { Command } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import util from 'util';
import { stripIndents } from 'common-tags';

export default class EvalCommand extends Command {
    public hrStart: [number, number] | undefined;

    public lastResult: any = null

    private readonly _sensitivePattern!: any;

    public constructor() {
        super('eval', {
            aliases: ['eval'],
            description: {
                content: 'Evaluates JavaScript.',
                usage: '<code>'
            },
            category: 'owner',
            ownerOnly: true,
            ratelimit: 5,
            args: [
                {
                    id: 'code',
                    match: 'content'
                }
            ]
        });
    }

    public async exec(message: Message, { code }: { code: string }): Promise<Message | Message[] | Promise<Message | Message[]>[]> {
        // @ts-ignore
        const { client, lastResult } = this;
        let hrdiff;

        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(code);
            hrdiff = process.hrtime(hrStart);
        } catch (error) {
            return message.util!.send(`Error while evaluating: \`${error}\``);
        }

        this.hrStart = process.hrtime();
        const result = this._result(this.lastResult, hrdiff, code);

        if (Array.isArray(result)) return result.map(async (res): Promise<Message | Message[]> => message.util!.send(res));
        return message.util!.send(result);
    }

    private _result(result: any, hrDiff: [number, number], input: string | null = null): string | string[] {
        const inspected = util.inspect(result, { depth: 0 })
            .replace(new RegExp('!!NL!!', 'g'), '\n')
            .replace(this.sensitivePattern, '[redacted]');
        const split = inspected.split('\n');
        const last = inspected.length - 1;
        const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ? split[split.length - 1] : inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
        const append = `\n${appendPart}\n\`\`\``;
        if (input) {
            return Util.splitMessage(stripIndents`
				*Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
        }

        return Util.splitMessage(stripIndents`
            *Callback executed after **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.***
            \`\`\`javascript
            ${inspected}
            \`\`\`
        `, { maxLength: 1900, prepend, append });
    }

    private get sensitivePattern(): any {
        if (!this.sensitivePattern) {
            const token = this.client.token!.split('').join('[^]{0,2}');
            const revToken = this.client.token!.split('').reverse().join('[^]{0,2}');
            Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(`${token}|${revToken}`, 'g') });
        }

        return this._sensitivePattern;
    }
}