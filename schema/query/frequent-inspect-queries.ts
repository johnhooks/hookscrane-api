import { DocType } from "@prisma/client";
import { queryField, nonNull, nullable, list, arg } from "nexus";
import { NexusGenObjects } from "schema/generated/nexus";
import { startOfDay, endOfDay } from "date-fns";

type FrequentInspect = NexusGenObjects["FrequentInspect"];

const frequentInspectSelect = {
  datetime: true,
  hours: true,
  id: true,
  meta: true,
  pass: true,
};

export const recentFrequentInspectsQueryField = queryField("recentFrequentInspects", {
  type: nonNull(list(nonNull("FrequentInspect"))),
  resolve: async (_parent, _args, context, _info) => {
    const inspects = await context.prisma.document.findMany({
      where: {
        type: DocType.INSPECT_CRANE_FREQUENT,
      },
      orderBy: [
        {
          datetime: "desc",
        },
      ],
      take: 20,
      select: frequentInspectSelect,
    });

    // The hours field is validated as a number at document creation
    return inspects as FrequentInspect[];
  },
});

export const frequentInspectByIdQueryField = queryField("frequentInspectById", {
  type: nullable("FrequentInspect"),
  args: {
    id: nonNull(arg({ type: "Int" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const inspect = await context.prisma.document.findUnique({
      where: {
        id: args.id,
      },
      select: { ...frequentInspectSelect, type: true },
    });

    if (!inspect) return null;
    if (inspect.type !== DocType.INSPECT_CRANE_FREQUENT) return null;

    // The hours field is validated as a number at document creation
    return inspect as FrequentInspect;
  },
});

export const frequentInspectByDateQueryField = queryField("frequentInspectByDate", {
  type: nonNull(list(nonNull("FrequentInspect"))),
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
        type: DocType.INSPECT_CRANE_FREQUENT,
      },
      select: frequentInspectSelect,
    });
    return inspects as FrequentInspect[];
  },
});
