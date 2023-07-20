import {
  Arg,
  ClassType,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Product } from "../../entity/Product";
import { Length } from "class-validator";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

function createResolver<T extends ClassType, U extends ClassType>(
  suffix: string,
  ReturnType: T,
  InputType: U,
  entity: any,
  middleware?: Middleware<any>[]
) {
  @Resolver()
  class BaseResolver {
    @Mutation(() => ReturnType, { name: `create${suffix}` })
    @UseMiddleware(...(middleware || []))
    async create(@Arg("payload", () => InputType) payload: typeof InputType) {
      return entity.create(payload).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  @Length(1, 255)
  name: string;
}

export const CreateUserResolver = createResolver(
  "User",
  User,
  RegisterInput,
  User
);
export const CreateProductResolver = createResolver(
  "Product",
  Product,
  ProductInput,
  Product
);
