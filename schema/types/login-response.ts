import { objectType } from "nexus";

export const LoginResponseType = objectType({
  name: "LoginResponse",
  definition(t) {
    t.nonNull.field("user", { type: "User" });
    t.nonNull.string("token");
    t.nonNull.date("tokenExpires");
  },
});
