import { Document, Schema, model } from 'mongoose';

export interface Stats extends Document {
    id: string,
    name: string,
    commands: Map<string, number>,
    emojis: Map<string, number>,
    reactions: Map<string, number>,
    messages: number
}

const StatsSchema = new Schema({
    id: String,
    name: String,
    commands: {
        type: Map,
        of: Number
    },
    emojis: {
        type: Map,
        of: Number
    },
    reactions: {
        type: Map,
        of: Number
    },
    messages: Number
});

export const Stats = model<Stats>('Stats', StatsSchema);
