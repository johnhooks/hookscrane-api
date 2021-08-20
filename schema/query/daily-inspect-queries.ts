import { queryField, nonNull, nullable, list, arg } from "nexus";

export const allDailyInspectsQueryField = queryField("allDailyInspects", {
  type: nonNull(list(nonNull("DailyInspect"))),
  resolve: async (_parent, args, context, _info) => {
    const inspects = await context.prisma.dailyInspect.findMany({});
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
