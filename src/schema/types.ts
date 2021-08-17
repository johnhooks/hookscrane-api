import { asNexusMethod, enumType } from "nexus";
import { DateTimeResolver } from "graphql-scalars";

export { Query } from "./query";
export { Mutation } from "./mutation";
export { UserType, UserUniqueInput, UserCreateInput } from "./user";
export { PostType, PostOrderByUpdatedAtInput, PostCreateInput } from "./post";
export { CommentType, CommentCreateInput } from "./comment";
export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});
