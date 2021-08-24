import { mutationField, nonNull } from "nexus";

import { refresh } from "lib/security";

export const refreshMutationField = mutationField("refresh", {
  type: nonNull("AccessTokenResponse"),
  resolve: async (_, _args, { prisma, request, reply }, _info) => {
    return refresh({ prisma, request, reply });
  },
});
