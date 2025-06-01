import Redis from 'ioredis';

console.log('Connecting to Redis ');
const redis = new Redis(process.env.REDIS_URL as string);
export default redis;
