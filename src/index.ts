import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import Express from "express";
import { AppDataSource } from "./datasource";
import appSession from "./appSession";
import http from "http";
import "reflect-metadata";
import { createSchema } from "./utils/createSchema";

const main = async () => {
  await AppDataSource.initialize();

  const isProduction = process.env.NODE_ENV === "production";

  const schema = await createSchema();

  const app = Express();
  app.use(appSession);
  !isProduction && app.set("trust proxy", 1);

  const httpServer = http.createServer(app);
  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

  !isProduction && plugins.push(ApolloServerPluginLandingPageLocalDefault());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    introspection: !isProduction
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ["https://studio.apollographql.com", "http://localhost:3000"]
    }
  });

  app.listen(4000, () => {
    console.log("Server started on http://localhost:4000");
  });
};

main();
