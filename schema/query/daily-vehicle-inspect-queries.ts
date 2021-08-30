import { DocType } from "@prisma/client";
import { queryField, nonNull, nullable, list, arg } from "nexus";
import { NexusGenObjects } from "schema/generated/nexus";
import { startOfDay, endOfDay } from "date-fns";

type DailyVehicleInspect = NexusGenObjects["DailyVehicleInspect"];

const inspectSelect = {
  datetime: true,
  id: true,
  miles: true,
  meta: true,
  pass: true,
};

export const recentDailyVehicleInspectsQueryField = queryField("recentDailyVehicleInspects", {
  type: nonNull(list(nonNull("DailyVehicleInspect"))),
  resolve: async (_parent, _args, context, _info) => {
    const inspects = await context.prisma.document.findMany({
      where: {
        type: DocType.INSPECT_VEHICLE_DAILY,
      },
      orderBy: [
        {
          datetime: "desc",
        },
      ],
      take: 20,
      select: inspectSelect,
    });

    // The hours field is validated as a number at document creation
    return inspects as DailyVehicleInspect[];
  },
});

export const dailyVehicleInspectByIdQueryField = queryField("dailyVehicleInspectById", {
  type: nullable("DailyVehicleInspect"),
  args: {
    id: nonNull(arg({ type: "Int" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const inspect = await context.prisma.document.findUnique({
      where: {
        id: args.id,
      },
      select: { ...inspectSelect, type: true },
    });

    if (!inspect) return null;
    if (inspect.type !== DocType.INSPECT_VEHICLE_DAILY) return null;

    // The hours field is validated as a number at document creation
    return inspect as DailyVehicleInspect;
  },
});

export const dailyVehicleInspectByDateQueryField = queryField("dailyVehicleInspectByDate", {
  type: nonNull(list(nonNull("DailyVehicleInspect"))),
  args: {
    date: nonNull(arg({ type: "Date" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const { date } = args;
    const inspects = await context.prisma.document.findMany({
      where: {
        datetime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        type: DocType.INSPECT_VEHICLE_DAILY,
      },
      select: inspectSelect,
    });
    return inspects as DailyVehicleInspect[];
  },
});
