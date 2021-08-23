import { enumType } from "nexus";
import { InspectType as InspectEnumType, LogType as LogEnumType, Role } from "nexus-prisma";

export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});

export const RoleType = enumType(Role);
export const InspectType = enumType(InspectEnumType);
export const LogType = enumType(LogEnumType);
