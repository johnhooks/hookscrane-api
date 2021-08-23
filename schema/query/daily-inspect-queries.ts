import { queryField, nonNull, nullable, list, arg } from "nexus";
import { startOfDay, endOfDay } from "date-fns";

export const allDailyInspectsQueryField = queryField("allDailyInspects", {
  type: nonNull(list(nonNull("DailyInspect"))),
  resolve: async (_parent, args, context, _info) => {
    const inspects = await context.prisma.dailyInspect.findMany({
      orderBy: [
        {
          datetime: "desc",
        },
      ],
      take: 20,
    });
    return inspects;
  },
});

export const dailyInspectByIdQueryField = queryField("dailyInspectById", {
  type: nullable("DailyInspect"),
  args: {
    id: nonNull(arg({ type: "Int" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const inspect = await context.prisma.dailyInspect.findUnique({
      where: {
        id: args.id,
      },
    });
    return inspect;
  },
});

export const dailyInspectByDateQueryField = queryField("dailyInspectByDate", {
  type: nonNull(list(nonNull("DailyInspect"))),
  args: {
    date: nonNull(arg({ type: "Date" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const { date } = args;
    const inspect = await context.prisma.dailyInspect.findMany({
      where: {
        datetime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
    });
    return inspect;
  },
});
