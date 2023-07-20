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

afterAll(async () => conn.destroy());

const meQuery = `
{
  me {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Me", () => {
  it("get user", async () => {
    const user = await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }).save();

    const res = await gqlCall({
      source: meQuery,
      userId: user.id
    });

    expect(res).toMatchObject({
      data: {
        me: {
          id: `${user.id}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  });

  it("return null", async () => {
    const res = await gqlCall({
      source: meQuery
    });

    expect(res).toMatchObject({
      data: {
        me: null
      }
    });
  });
});
