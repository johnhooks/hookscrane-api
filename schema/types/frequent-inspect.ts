import { objectType, inputObjectType } from "nexus";

export const FrequentInspectType = objectType({
  name: "FrequentInspect",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.datetime("datetime");
    t.nonNull.int("hours");
    t.nullable.json("meta");
  },
});

export const FrequentInspectUniqueInput = inputObjectType({
  name: "FrequentInspectUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const FrequentInspectCreateInput = inputObjectType({
  name: "FrequentInspectCreateInput",
  definition(t) {
    t.nonNull.datetime("datetime");
    t.nonNull.int("hours");
    t.nullable.json("meta");
  },
});
