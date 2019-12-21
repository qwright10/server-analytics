import { Document, Schema, model } from 'mongoose';

export interface Settings extends Document {
    id: string,
    name: string,
    prefix: string,
    blacklist: Array<string>
}

const SettingsSchema = new Schema({
    id: String,
    name: String,
    prefix: String,
    blacklist: Array
});

export const Settings = model<Settings>('Settings', SettingsSchema);
