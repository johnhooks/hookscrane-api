import { objectType, inputObjectType } from "nexus";
import { User } from "nexus-prisma";

export const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.nonNull.field(User.id);
    t.nonNull.field(User.email);
    t.field(User.firstName);
    t.field(User.lastName);
    t.nonNull.field(User.roles);
  },
});

export const UserUniqueInput = inputObjectType({
  name: "UserUniqueInput",
  definition(t) {
    t.int("id");
    t.string("email");
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.nonNull.string("email");
    t.string("firstName");
    t.string("lastName");
  },
});
