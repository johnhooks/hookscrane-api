import { objectType, inputObjectType } from "nexus";

export const DailyVehicleInspectType = objectType({
  name: "DailyVehicleInspect",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.datetime("datetime");
    t.nonNull.int("miles");
    t.nullable.json("meta");
  },
});

export const DailyVehicleInspectUniqueInput = inputObjectType({
  name: "DailyVehicleInspectUniqueInput",
  definition(t) {
    t.nonNull.int("id");
  },
});

export const DailyVehicleInspectCreateInput = inputObjectType({
  name: "DailyVehicleInspectCreateInput",
  definition(t) {
    t.nonNull.datetime("datetime");
    t.nonNull.int("miles");
    t.nullable.json("meta");
  },
});
