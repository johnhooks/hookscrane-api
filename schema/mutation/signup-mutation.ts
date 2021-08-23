import { mutationField, nonNull, arg } from "nexus";

export const signupMutationField = mutationField("signup", {
  type: nonNull("User"),
  args: {
    data: nonNull(
      arg({
        type: "UserCreateInput",
      })
    ),
  },
  resolve: async (_, args, context, _info) => {
    const user = await context.prisma.user.create({
      data: {
        email: args.data.email,
        firstName: args.data.firstName,
        lastName: args.data.lastName,
        passwordDigest: "password",
        meta: {},
      },
    });
    return user;
  },
});
