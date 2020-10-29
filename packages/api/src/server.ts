import { config } from "dotenv";

import { set as mongooseSet, connect as mongooseConnect } from "mongoose";

import koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { PubSub } from "apollo-server";
import { RedisPubSub } from "graphql-redis-subscriptions";

import Redis from "ioredis";
import { RedisClient, createClient } from "redis";
import { promisifyAll } from "bluebird";
import exSchema from "./schemas/allSchemas";
import { contextController } from "./controllers/context";
import { IUserInToken } from "./models/interfaces";
import AuthService from "./auth-service/authService";

config();

const { REDIS_DOMAIN_NAME } = process.env;
const { REDIS_PORT_NUMBER } = process.env;
const USE_REDIS = String(process.env.USE_REDIS);

const { PORT } = process.env;

const mongoUrl: string = process.env.MONGO_URL as string;

mongooseSet("debug", true);
mongooseSet("useFindAndModify", false); // ojo con esto al desplegar
mongooseConnect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) {
      throw err;
    }
    console.log("Successfully connected to Mongo");
  }
);

let pubsub;
let redisClient;
if (USE_REDIS === "true") {
  // Redis configuration
  const redisOptions = {
    host: REDIS_DOMAIN_NAME,
    port: REDIS_PORT_NUMBER,
    retry_strategy: options =>
      // reconnect after
      Math.max(options.attempt * 100, 3000)
  };
  const allReviver = (key, value) => {
    if (value && value._id) {
      return { ...value, id: value._id };
    }
    return value;
  };
  // redis creation for subscriptions
  pubsub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
    reviver: allReviver
  });

  // Redis client for session tokens
  // to do async/await
  promisifyAll(RedisClient.prototype);
  redisClient = createClient(REDIS_PORT_NUMBER, REDIS_DOMAIN_NAME);
  redisClient.on("connect", () => {
    console.log("Redis client connected.");
  });
} else {
  pubsub = new PubSub();
}

const app = new koa();
const httpServer = app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);

const server = new ApolloServer({
  context: async ({ ctx, payload, req, connection }) => {
    const authorization =
      (ctx && ctx.headers && ctx.headers.authorization) ||
      (payload && payload.authorization) ||
      "";

    const user: IUserInToken | undefined = await contextController.getMyUser(
      authorization
    );
    return { user, headers: ctx && ctx.headers }; //  add the user to the ctx
  },
  schema: exSchema
});

const bitbloqAuthService = new AuthService(redisClient, 3600, true, email => {
  console.log("holi", email);
});
export { pubsub, redisClient, bitbloqAuthService };
server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);
