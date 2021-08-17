import { objectType, inputObjectType, asNexusMethod } from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { User } from "nexus-prisma";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const UserType = objectType({
  name: User.$name,
  definition(t) {
    t.field(User.id);
    t.field(User.email);
    t.field(User.firstName);
    t.field(User.lastName);
    // Relation fields can use the generated resolver from nexus-prisma or a custom one
    t.field(User.posts);
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
    t.list.nonNull.field("posts", { type: "PostCreateInput" });
  },
});
