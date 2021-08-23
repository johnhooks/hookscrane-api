import { queryField, objectType } from "nexus";

export const statusQueryField = queryField("status", {
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
