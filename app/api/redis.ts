import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://comic-ox-39691.upstash.io",
  token: process.env.REDIS_TOKEN!, //had to put ! to guarantee not null
});

export default redis;
