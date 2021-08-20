import { mutationField, nonNull, arg } from "nexus";

export const createDailyInspectMutationField = mutationField("createDailyInspect", {
  type: "DailyInspect",
  args: {
    data: nonNull(
      arg({
        type: "DailyInspectCreateInput",
      })
    ),
  },
  resolve: async (_, args, context) => {
    const item = await context.prisma.dailyInspect.create({
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
