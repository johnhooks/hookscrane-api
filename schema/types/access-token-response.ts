import { objectType } from "nexus";

export const AccessTokenResponseType = objectType({
  name: "AccessTokenResponse",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.datetime("tokenExpires");
  },
});
