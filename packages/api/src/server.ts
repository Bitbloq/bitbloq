import { config } from "dotenv";
config();

import { set as mongooseSet, connect as mongooseConnect } from "mongoose";
import { contextController } from "./controllers/context";
import exSchema from "./schemas/allSchemas";

import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { PubSub } from "apollo-server";
import { RedisPubSub } from "graphql-redis-subscriptions";

import * as Redis from "ioredis";
import { RedisClient, createClient } from "redis";
import { promisifyAll } from "bluebird";

const REDIS_DOMAIN_NAME = process.env.REDIS_DOMAIN_NAME;
const REDIS_PORT_NUMBER = process.env.REDIS_PORT_NUMBER;
const USE_REDIS: string = String(process.env.USE_REDIS);

const PORT = process.env.PORT;

const mongoUrl: string = process.env.MONGO_URL as string;

mongooseSet("debug", true);
mongooseSet("useFindAndModify", false); // ojo con esto al desplegar
mongooseConnect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true },
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
    retry_strategy: options => {
      // reconnect after
      return Math.max(options.attempt * 100, 3000);
    }
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

const app = new Koa();
const httpServer = app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);

const server = new ApolloServer({
  context: async ({ ctx, req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      const user = await contextController.getMyUser(ctx);
      return { user, headers: ctx.headers }; //  add the user to the ctx
    }
  },
  schema: exSchema,
  subscriptions: {
    onConnect: async (connectionParams: any) => {
      if (connectionParams.authorization) {
        const justToken = connectionParams.authorization.split(" ")[1];
        const user = await contextController.getDataInToken(justToken);
        return { user }; //  add the user to the ctx
      }
      return undefined;
    }
  }
});

export { pubsub, redisClient };
server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);
