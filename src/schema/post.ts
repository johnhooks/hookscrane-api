import { objectType, inputObjectType } from "nexus";
import { Post } from "nexus-prisma";

export const PostType = objectType({
  name: "Post",
  definition(t) {
    t.field(Post.id);
    t.field(Post.createdAt);
    t.field(Post.updatedAt);
    t.field(Post.title);
    t.field(Post.content);
    t.field(Post.published);
    t.field(Post.likes);
    // Relation fields and generated resolvers from nexus-prisma
    t.field(Post.author);

    // The n+1 problem occurs when you loop through the results of a query and perform one additional query per result
    // resulting in n number of queries plus the original (n+1).
    // This can be a problem here when resolving a query that fetches multiple posts and the comments for each.

    // 👇 The resolver for the `comments` field is automatically generated by nexus-prisma
    t.field(Post.comments);

    // 👇 Alternatively, it can be defined manually
    // t.nonNull.list.nonNull.field('comments', {
    //   type: 'Comment',
    //   resolve: (parent, args, ctx) => {
    //     // Prisma's Dataloader will batch the queries to avoid the n+1 problem
    //     // 👇 When findUnique is used in combination with the fluent API `.comments()`
    //     return ctx.prisma.post
    //       .findUnique({
    //         where: {
    //           id: parent.id,
    //         },
    //       })
    //       .comments()

    //     // 👇 This will lead to the n+1 problem because `findMany` are not batched
    //     // return ctx.prisma.comment.findMany({
    //     //   where: {
    //     //     postId: parent.id,
    //     //   },
    //     // })
    //   },
    // })
  },
});

export const PostOrderByUpdatedAtInput = inputObjectType({
  name: "PostOrderByUpdatedAtInput",
  definition(t) {
    t.nonNull.field("updatedAt", { type: "SortOrder" });
  },
});

export const PostCreateInput = inputObjectType({
  name: "PostCreateInput",
  definition(t) {
    t.nonNull.string("title");
    t.string("content");
  },
});
