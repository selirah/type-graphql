import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";
import { logger } from "../middleware/logger";

@Resolver()
export class LoginResolver {
  @UseMiddleware(logger) // you can parse multiple middleware
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    if (!user.confirmed) {
      // check if user has confirmed email
      return null;
    }

    ctx.req.session.userId = user.id;

    return user;
  }
}
