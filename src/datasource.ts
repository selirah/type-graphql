import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "@1nc0rr3ct",
  database: "typegraphql-example",
  // synchronize: true,
  synchronize: false,
  logging: true,
  entities: ["src/entity/*.*"]
});

export default AppDataSource;
