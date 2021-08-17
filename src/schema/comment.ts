import { objectType, inputObjectType } from "nexus";
import { Comment } from "nexus-prisma";

export const CommentType = objectType({
  name: "Comment",
  definition(t) {
    t.field(Comment.id);
    t.field(Comment.createdAt);
    t.field(Comment.comment);
    // Relation fields and generated resolvers from nexus-prisma
    t.field(Comment.post);
    t.field(Comment.author);
  },
});

export const CommentCreateInput = inputObjectType({
  name: "CommentCreateInput",
  definition(t) {
    t.nonNull.string("comment");
  },
});
