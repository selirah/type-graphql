import { DataSource } from "typeorm";
import { gqlCall } from "../../test-utils/gqlCall";
import { initializeDataSource } from "../../test-utils/init";

let conn: DataSource;

beforeAll(async (): Promise<DataSource> => {
  conn = await initializeDataSource();
  return conn;
});

afterAll(async () => await conn.destroy());

const registerMutation = `
mutation($payload: RegisterInput!){
  register(payload: $payload) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    console.log(
      await gqlCall({
        source: registerMutation,
        variableValues: {
          payload: {
            firstName: "Edward",
            lastName: "Selirah",
            email: "edward@example.com",
            password: "password"
          }
        }
      })
    );
  });
});
