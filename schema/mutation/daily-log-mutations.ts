import { mutationField, nonNull, arg } from "nexus";

import { NotAuthorized } from "lib/errors";

export const createDailyLogMutationField = mutationField("createDailyLog", {
  type: "DailyLog",
  args: {
    data: nonNull(
      arg({
        type: "DailyLogCreateInput",
      })
    ),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.request.session?.user) throw NotAuthorized();
    const item = await ctx.prisma.dailyLog.create({
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
