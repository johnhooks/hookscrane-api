import { objectType, inputObjectType } from "nexus";

import { DailyLog } from "nexus-prisma";

export const DailyLogType = objectType({
  name: "DailyLog",
  definition(t) {
    t.field(DailyLog.id);
    t.field(DailyLog.type);
    t.field(DailyLog.datetime);
    t.field(DailyLog.miles);
    t.json("meta");
  },
});

export const DailyLogUniqueInput = inputObjectType({
  name: "DailyLogUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const DailyLogCreateInput = inputObjectType({
  name: "DailyLogCreateInput",
  definition(t) {
    t.field(DailyLog.type);
    t.field(DailyLog.datetime);
    t.field(DailyLog.miles);
    t.json("meta");
  },
});
