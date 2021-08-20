import { objectType, inputObjectType } from "nexus";

export const ItemType = objectType({
  name: "Item",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.string("text");
    t.json("meta");
    t.nonNull.list.nonNull.field("children", {
      type: "DocumentEdge",
      resolve: (parent, args, ctx) => {
        // Prisma's Dataloader will batch the queries to avoid the n+1 problem
        // 👇 When findUnique is used in combination with the fluent API `.comments()`
        return ctx.prisma.documentNode
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .children({
            select: {
              type: true,
              parentId: true,
              childId: true,
            },
          });
      },
    });
  },
});

export const ItemUniqueInput = inputObjectType({
  name: "ItemUniqueInput",
  definition(t) {
    t.int("id");
    t.string("email");
  },
});

export const ItemCreateInput = inputObjectType({
  name: "ItemCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("text");
    t.json("meta");
  },
});
