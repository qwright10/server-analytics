"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SettingsSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    prefix: String,
    blacklist: Array
});
exports.Settings = mongoose_1.model('Settings', SettingsSchema);
