import '../utils/env.js';
import redis from 'redis';

const redisClient = redis.createClient({
  host: 'redis',
  port: process.env.REDIS_PORT,
});
// await redisClient.connect(); // 배포 시 지워줘야 됨

export default redisClient;
