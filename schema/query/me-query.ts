import { queryField } from "nexus";

import { NotAuthorized } from "lib/errors";

export const meQueryField = queryField("me", {
  type: "User",
  resolve: (_parent, _args, ctx) => {
    if (ctx.request.session) {
      const user = ctx.prisma.user.findUnique({
        where: {
          id: ctx.request.session.user.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          roles: true,
        },
      });

      if (user) return user;
    }

    throw NotAuthorized();
  },
});
