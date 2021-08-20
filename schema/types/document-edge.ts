import { objectType } from "nexus";
import { DocumentEdge as Edge } from "nexus-prisma";

export const DocumentEdge = objectType({
  name: Edge.$name,
  definition(t) {
    t.field(Edge.type);

    t.field(Edge.parent);
    t.field(Edge.child);
  },
});
