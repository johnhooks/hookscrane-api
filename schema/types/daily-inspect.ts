import { objectType, inputObjectType } from "nexus";

import { DailyInspect } from "nexus-prisma";

export const DailyInspectType = objectType({
  name: "DailyInspect",
  definition(t) {
    t.field(DailyInspect.id);
    t.field(DailyInspect.type);
    t.field(DailyInspect.datetime);
    t.field(DailyInspect.hours);
    t.json("meta");
  },
});

export const DailyInspectUniqueInput = inputObjectType({
  name: "DailyInspectUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const DailyInspectCreateInput = inputObjectType({
  name: "DailyInspectCreateInput",
  definition(t) {
    t.field(DailyInspect.type);
    t.field(DailyInspect.datetime);
    t.field(DailyInspect.hours);
    t.json("meta");
  },
});
