import { mutationField, nonNull, stringArg } from "nexus";

import { login } from "lib/security";

export const loginMutationField = mutationField("login", {
  type: nonNull("AccessTokenResponse"),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, { email, password }, { request, reply, prisma }, _info) => {
    return login({ prisma, request, reply, email, password });
  },
});
