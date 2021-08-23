import { mutationField, nonNull, stringArg } from "nexus";

import { LoginFailed } from "lib/errors";

export const loginMutationField = mutationField("login", {
  type: nonNull("LoginResponse"),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx, _info) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: args.email,
      },
      select: {
        id: true,
        passwordDigest: true,
        email: true,
        roles: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) throw LoginFailed();

    // dummy response
    return { token: "token", tokenExpires: new Date(1), user };
  },
});
