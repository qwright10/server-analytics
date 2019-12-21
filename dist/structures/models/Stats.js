"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StatsSchema = new mongoose_1.Schema({
    id: String,
    name: String,
    emojis: {
        type: Map,
        of: Number
    },
    messages: Number
});
exports.Stats = mongoose_1.model('Stats', StatsSchema);
