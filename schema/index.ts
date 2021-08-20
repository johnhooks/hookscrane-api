import * as path from "path";
import { makeSchema } from "nexus";

import * as types from "./types";
import * as query from "./query";
import * as mutation from "./mutation";

export const schema = makeSchema({
  types: { ...types, ...query, ...mutation },
  outputs: {
    schema: path.join(__dirname, "../schema.graphql"),
    typegen: path.join(__dirname, "./generated/nexus.ts"),
  },
  contextType: {
    // After building we still need to find the src directory for the ts file
    module: path.join(__dirname, "../lib/context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
