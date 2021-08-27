import { mutationField, nonNull, arg } from "nexus";
import { NexusGenObjects } from "schema/generated/nexus";

import { DocType } from "@prisma/client";
import { NotAuthorized } from "lib/errors";

type DailyVehicleInspect = NexusGenObjects["DailyVehicleInspect"];

export const createDailyVehicleInspectMutationField = mutationField("createDailyVehicleInspect", {
  type: "DailyVehicleInspect",
  args: {
    data: nonNull(
      arg({
        type: "DailyVehicleInspectCreateInput",
      })
    ),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.request.session?.user) throw NotAuthorized();
    const inspect = await ctx.prisma.document.create({
      data: {
        type: DocType.INSPECT_VEHICLE_DAILY,
        datetime: args.data.datetime,
        miles: args.data.miles,
        meta: args.data.meta,
        userId: ctx.request.session.user.id,
      },
      select: {
        id: true,
        datetime: true,
        miles: true,
        meta: true,
      },
    });
    // `miles` was a Int when the request was accepted, it should definitely still be a number.
    return inspect as DailyVehicleInspect;
  },
});
