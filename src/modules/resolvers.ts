import { NonEmptyArray } from "type-graphql";
import { RegisterResolver } from "./user/Register";
import { MeResolver } from "./user/Me";
import { LoginResolver } from "./user/Login";
import { LogoutResolver } from "./user/Logout";
import { ForgotPasswordResolver } from "./user/ForgotPassword";
import { ConfirmUserResolver } from "./user/ConfirmUser";
import { ChangePasswordResolver } from "./user/ChangePassword";

export const resolvers: NonEmptyArray<Function> = [
  RegisterResolver,
  MeResolver,
  LoginResolver,
  LogoutResolver,
  ForgotPasswordResolver,
  ConfirmUserResolver,
  ChangePasswordResolver
];
