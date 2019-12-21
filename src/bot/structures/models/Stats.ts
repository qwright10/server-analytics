import { Document, Schema, model } from 'mongoose';

export interface Stats extends Document {
    id: string,
    name: string,
    emojis: Map<string, Number>,
    messages: number
}

const StatsSchema = new Schema({
    id: String,
    name: String,
    emojis: {
        type: Map,
        of: Number
    },
    messages: Number
});

export const Stats = model<Stats>('Stats', StatsSchema);
