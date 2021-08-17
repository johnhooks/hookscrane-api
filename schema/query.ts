import { intArg, nonNull, objectType, stringArg, arg, booleanArg } from "nexus";

import { NotAuthorized } from "lib/errors";

export const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: async (_parent, _args, context, _info) => {
        if (!context.request.session) throw NotAuthorized();
        const users = await context.prisma.user.findMany();
        return users;
      },
    });

    t.field("status", {
      type: objectType({
        name: "Status",
        definition(t) {
          t.boolean("up");
        },
      }),
      resolve: (_parent, _args, _context) => {
        return { up: true };
      },
    });

    t.nullable.field("postById", {
      type: "Post",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_parent, args, context, _info) => {
        const posts = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
        });
        return posts;
      },
    });

    t.nonNull.list.nonNull.field("feed", {
      type: "Post",
      args: {
        published: booleanArg(),
        searchString: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: "PostOrderByUpdatedAtInput",
        }),
      },
      resolve: async (_parent, args, context, _info) => {
        const or = args.searchString
          ? {
              OR: [
                { title: { contains: args.searchString } },
                { content: { contains: args.searchString } },
              ],
            }
          : {};
        const feed = context.prisma.post.findMany({
          where: {
            published: args.published ?? true,
            ...or,
          },
          take: args.take || undefined,
          skip: args.skip || undefined,
          orderBy: args.orderBy || undefined,
        });
        return feed;
      },
    });

    t.list.field("draftsByUser", {
      type: "Post",
      args: {
        userUniqueInput: nonNull(
          arg({
            type: "UserUniqueInput",
          })
        ),
      },
      resolve: async (_parent, args, context, _info) => {
        const drafts = await context.prisma.user
          .findUnique({
            where: {
              id: args.userUniqueInput.id || undefined,
              email: args.userUniqueInput.email || undefined,
            },
          })
          .posts({
            where: {
              published: false,
            },
          });
        return drafts;
      },
    });
  },
});
