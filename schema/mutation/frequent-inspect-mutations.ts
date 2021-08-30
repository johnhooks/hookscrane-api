import { mutationField, nonNull, arg } from "nexus";
import { NexusGenObjects } from "schema/generated/nexus";

import { DocType } from "@prisma/client";
import { NotAuthorized } from "lib/errors";

type FrequentInspect = NexusGenObjects["FrequentInspect"];

export const createFrequentInspectMutationField = mutationField("createFrequentInspect", {
  type: "FrequentInspect",
  args: {
    data: nonNull(
      arg({
        type: "FrequentInspectCreateInput",
      })
    ),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.request.session?.user) throw NotAuthorized();
    const deficiencies = args.data?.meta?.deficiencies;
    const pass =
      deficiencies === undefined || (Array.isArray(deficiencies) && deficiencies.length === 0);
    const inspect = await ctx.prisma.document.create({
      data: {
        type: DocType.INSPECT_CRANE_FREQUENT,
        datetime: args.data.datetime,
        hours: args.data.hours,
        meta: args.data.meta,
        pass,
        userId: ctx.request.session.user.id,
      },
      select: {
        datetime: true,
        hours: true,
        id: true,
        meta: true,
        pass: true,
      },
    });
    // `hours` was a Int when the request was accepted, it should definitely still be a number.
    return inspect as FrequentInspect;
  },
});
