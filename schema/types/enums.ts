import { enumType } from "nexus";
import {
  InspectType as InspectEnumType,
  LogType as LogEnumType,
  Role,
  DocType as DocEnumType,
} from "nexus-prisma";

export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});

export const DocType = enumType(DocEnumType);
export const RoleType = enumType(Role);
export const InspectType = enumType(InspectEnumType);
export const LogType = enumType(LogEnumType);
