import { DataSource } from "typeorm";
import { gqlCall } from "../../test-utils/gqlCall";
import { initializeDataSource } from "../../test-utils/init";
import { faker } from "@faker-js/faker";
import { User } from "../../entity/User";

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
    const payload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const res = await gqlCall({
      source: registerMutation,
      variableValues: {
        payload
      }
    });

    expect(res).toMatchObject({
      data: {
        register: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: payload.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(payload.firstName);
  });
});
