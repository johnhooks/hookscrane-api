import { asNexusMethod } from "nexus";
import { DateResolver, DateTimeResolver, JSONObjectResolver } from "graphql-scalars";

export const Date = asNexusMethod(DateResolver, "date");
export const DateTime = asNexusMethod(DateTimeResolver, "datetime");
export const Json = asNexusMethod(JSONObjectResolver, "json");

export { DocType, RoleType, SortOrder } from "./enums";
export { UserType, UserUniqueInput, UserCreateInput } from "./user";
export { AccessTokenResponseType } from "./access-token-response";
export {
  DailyVehicleInspectType,
  DailyVehicleInspectUniqueInput,
  DailyVehicleInspectCreateInput,
} from "./daily-vehicle-inspect";
export { DocumentType } from "./document";
export {
  FrequentInspectType,
  FrequentInspectUniqueInput,
  FrequentInspectCreateInput,
} from "./frequent-inspect";
