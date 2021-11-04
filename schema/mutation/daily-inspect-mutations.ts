import { mutationField, nonNull, arg } from "nexus";

import { NotAuthorized } from "lib/errors";

export const createDailyInspectMutationField = mutationField("createDailyInspect", {
  type: "DailyInspect",
  args: {
    data: nonNull(
      arg({
        type: "DailyInspectCreateInput",
      })
    ),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.request.session?.user) throw NotAuthorized();
    const item = await ctx.prisma.dailyInspect.create({
      data: {
        type: args.data.type,
        datetime: args.data.datetime,
        hours: args.data.hours,
        meta: args.data.meta,
      },
    });
    return item;
  },
});
