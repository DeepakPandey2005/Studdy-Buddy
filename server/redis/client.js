const ioredis = require('ioredis');

const redis = new ioredis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379
});

redis.on("connect", () => {
  console.log("Redis connected");
});
module.exports = redis;