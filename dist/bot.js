"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsClient_1 = require("./client/AnalyticsClient");
require("dotenv/config");
const client = new AnalyticsClient_1.AnalyticsClient({
    owner: process.env.owner,
    token: process.env.token
});
client.start();
