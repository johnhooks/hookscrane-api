import { asNexusMethod } from "nexus";
import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars";

export const DateTime = asNexusMethod(DateTimeResolver, "date");
export const Json = asNexusMethod(JSONObjectResolver, "json");

export {
  SortOrder,
  DocumentNodeType,
  DocumentEdgeType,
  InspectType,
  LogType,
  RoleType,
} from "./enums";
export { UserType, UserUniqueInput, UserCreateInput } from "./user";
export { LoginResponseType } from "./login-response";
export { PostType, PostOrderByUpdatedAtInput, PostCreateInput } from "./post";
export { CommentType, CommentCreateInput } from "./comment";
export { DocumentNode } from "./document-node";
export { DocumentEdge } from "./document-edge";
export { ItemType, ItemUniqueInput, ItemCreateInput } from "./item";
export { DailyLogType, DailyLogUniqueInput, DailyLogCreateInput } from "./daily-log";
export {
  DailyInspectType,
  DailyInspectUniqueInput,
  DailyInspectCreateInput,
} from "./daily-inspect";
