import { AnalyticsClient } from './client/AnalyticsClient';
import 'dotenv/config';

const client = new AnalyticsClient({
    owner: process.env.owner,
    token: process.env.token
});

client.start();