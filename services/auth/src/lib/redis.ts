import 'dotenv/config';
import { createClient } from 'redis';

import logger from '../config/logger';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is not defined');
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('ready', () => {
  logger.info('Redis client connected successfully and ready to use.');
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.connect();
export { redisClient };
