import { queryField, nonNull, nullable, list, arg } from "nexus";

export const allDailyLogsQueryField = queryField("allDailyLogs", {
  type: nonNull(list(nonNull("DailyLog"))),
  resolve: async (_parent, args, context, _info) => {
    const logs = await context.prisma.dailyLog.findMany({});
    return logs;
  },
});

export const dailyLogsByIdQueryField = queryField("dailyLogsById", {
  type: nullable("DailyLog"),
  args: {
    id: nonNull(arg({ type: "Int" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const log = await context.prisma.dailyLog.findUnique({
      where: {
        id: args.id,
      },
    });
    return log;
  },
});
