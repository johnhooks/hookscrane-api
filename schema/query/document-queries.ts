import { queryField, nonNull, nullable, list, arg } from "nexus";
import { startOfDay, endOfDay } from "date-fns";

const documentSelect = {
  datetime: true,
  hours: true,
  id: true,
  miles: true,
  meta: true,
  pass: true,
  type: true,
};

export const recentDocumentsQueryField = queryField("recentDocuments", {
  type: nonNull(list(nonNull("Document"))),
  args: {
    types: nullable(list(nonNull(arg({ type: "DocType" })))),
  },
  resolve: async (_parent, args, context, _info) => {
    const { types } = args;
    const OR = types ? types.map(type => ({ type })) : undefined;
    const documents = await context.prisma.document.findMany({
      where: {
        OR,
      },
      orderBy: [
        {
          datetime: "desc",
        },
      ],
      take: 20,
      select: documentSelect,
    });
    return documents;
  },
});

export const documentByIdField = queryField("documentById", {
  type: nullable("Document"),
  args: {
    id: nonNull(arg({ type: "Int" })),
  },
  resolve: async (_parent, args, context, _info) => {
    const { id } = args;
    const documents = await context.prisma.document.findUnique({
      where: {
        id,
      },
      select: documentSelect,
    });
    return documents;
  },
});

export const documentByDateQueryField = queryField("documentByDate", {
  type: nonNull(list(nonNull("Document"))),
  args: {
    date: nonNull(arg({ type: "Date" })),
    types: nullable(list(nonNull(arg({ type: "DocType" })))),
  },
  resolve: async (_parent, args, context, _info) => {
    const { date, types } = args;
    const OR = types ? types.map(type => ({ type })) : undefined;
    const documents = await context.prisma.document.findMany({
      where: {
        OR,
        datetime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      select: documentSelect,
    });
    return documents;
  },
});
