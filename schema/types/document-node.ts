import { objectType, inputObjectType } from "nexus";
import { DocumentNode as Node } from "nexus-prisma";

export const DocumentNode = objectType({
  name: Node.$name,
  definition(t) {
    t.field(Node.id);
    t.field(Node.type);
    t.field(Node.name);
    t.field(Node.text);

    t.field(Node.parents);
    t.field(Node.children);
    // t.nonNull.list.nonNull.field("children", {
    //   type: "DocumentEdge",
    //   resolve: (parent, args, ctx) => {
    //     // Prisma's Dataloader will batch the queries to avoid the n+1 problem
    //     // 👇 When findUnique is used in combination with the fluent API `.comments()`
    //     return ctx.prisma.documentNode
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .children({
    //         select: {
    //           type: true,
    //           parentId: true,
    //           childId: true,
    //         },
    //       });
    //   },
    // });
  },
});

export const NodeUniqueInput = inputObjectType({
  name: "NodeUniqueInput",
  definition(t) {
    t.int("id");
    t.string("email");
  },
});

export const NodeCreateInput = inputObjectType({
  name: "NodeCreateInput",
  definition(t) {
    t.nonNull.string("name");
    t.nonNull.field("type", { type: "DocumentNodeType" });
    t.string("text");
    t.json("meta");
  },
});
