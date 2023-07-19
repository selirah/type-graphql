import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import Express from "express";
import { buildSchema } from "type-graphql";
import AppDataSource from "./datasource";
import appSession from "./appSession";
import http from "http";
import "reflect-metadata";

const main = async () => {
  await AppDataSource.initialize();

  const isProduction = process.env.NODE_ENV === "production";

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    emitSchemaFile: true,
    authChecker: ({ context: { req } }) => {
      // here we can read the user from context
      // and check his permission in the db against the `roles` argument
      // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
      return !!req.session.userId;
    }
  });

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
