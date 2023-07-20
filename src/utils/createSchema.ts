import { buildSchema } from "type-graphql";
import { resolvers } from "../modules/resolvers";

export const createSchema = () =>
  buildSchema({
    resolvers,
    // emitSchemaFile: true,
    authChecker: ({ context: { req } }) => {
      // here we can read the user from context
      // and check his permission in the db against the `roles` argument
      // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
      return !!req.session.userId;
    }
  });
