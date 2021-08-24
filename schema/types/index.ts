import { asNexusMethod } from "nexus";
import { DateResolver, DateTimeResolver, JSONObjectResolver } from "graphql-scalars";

export const Date = asNexusMethod(DateResolver, "date");
export const DateTime = asNexusMethod(DateTimeResolver, "datetime");
export const Json = asNexusMethod(JSONObjectResolver, "json");

export { SortOrder, InspectType, LogType, RoleType } from "./enums";
export { UserType, UserUniqueInput, UserCreateInput } from "./user";
export { AccessTokenResponseType } from "./access-token-response";
export { DailyLogType, DailyLogUniqueInput, DailyLogCreateInput } from "./daily-log";
export {
  DailyInspectType,
  DailyInspectUniqueInput,
  DailyInspectCreateInput,
} from "./daily-inspect";
