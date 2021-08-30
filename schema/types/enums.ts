import { enumType } from "nexus";
import { Role, DocType as DocEnumType } from "nexus-prisma";

export const SortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});

export const DocType = enumType(DocEnumType);
export const RoleType = enumType(Role);
