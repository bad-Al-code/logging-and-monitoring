import 'dotenv/config';
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is not defined');
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('ready', () => {
  console.log('Redis client connected successfully and ready to use.');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();
export { redisClient };
