import { objectType } from "nexus";

import { Document } from "nexus-prisma";

export const DocumentType = objectType({
  name: Document.$name,
  description: Document.$description,
  definition(t) {
    t.field(Document.id);
    t.field(Document.type);
    t.field(Document.datetime);
    t.field(Document.miles);
    t.field(Document.hours);
    t.field(Document.pass);
    t.json("meta");
  },
});
