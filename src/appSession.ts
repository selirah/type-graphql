import session from "express-session";
import RedisStore from "connect-redis";
import { redis } from "./redis";

const appSession = session({
  name: "qid",
  store: new RedisStore({
    client: redis
  }),
  secret: "andjnsjfbiwj4332323iwndnw", // use .env to store this
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
  }
});

export default appSession;
