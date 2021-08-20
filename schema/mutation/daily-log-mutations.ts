import { mutationField, nonNull, arg } from "nexus";

export const createDailyLogMutationField = mutationField("createDailyLog", {
  type: "DailyLog",
  args: {
    data: nonNull(
      arg({
        type: "DailyLogCreateInput",
      })
    ),
  },
  resolve: async (_, args, context) => {
    const item = await context.prisma.dailyLog.create({
      data: {
        type: args.data.type,
        datetime: args.data.datetime,
        miles: args.data.miles,
        meta: args.data.meta,
      },
    });
    return item;
  },
});
