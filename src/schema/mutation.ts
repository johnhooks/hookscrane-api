import { intArg, nonNull, objectType, stringArg, arg, booleanArg } from "nexus";

export const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.nonNull.field("signupUser", {
      type: "User",
      args: {
        data: nonNull(
          arg({
            type: "UserCreateInput",
          })
        ),
      },
      resolve: async (_, args, context, _info) => {
        const postData = args.data.posts?.map(post => {
          return { title: post.title, content: post.content || undefined };
        });
        const user = await context.prisma.user.create({
          data: {
            email: args.data.email,
            firstName: args.data.firstName,
            lastName: args.data.lastName,
            passwordDigest: "password",
            posts: {
              create: postData,
            },
          },
        });
        return user;
      },
    });

    t.field("createDraft", {
      type: "Post",
      args: {
        data: nonNull(
          arg({
            type: "PostCreateInput",
          })
        ),
        authorEmail: nonNull(stringArg()),
      },
      resolve: async (_, args, context) => {
        const draft = await context.prisma.post.create({
          data: {
            title: args.data.title,
            content: args.data.content,
            author: {
              connect: { email: args.authorEmail },
            },
          },
        });
        return draft;
      },
    });

    t.field("createComment", {
      type: "Comment",
      args: {
        data: nonNull(
          arg({
            type: "CommentCreateInput",
          })
        ),
        authorEmail: nonNull(stringArg()),
        postId: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const comment = await context.prisma.comment.create({
          data: {
            comment: args.data.comment,
            post: {
              connect: { id: args.postId },
            },
            author: {
              connect: { email: args.authorEmail },
            },
          },
        });
        return comment;
      },
    });

    t.field("likePost", {
      type: "Post",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.update({
          data: {
            likes: {
              increment: 1,
            },
          },
          where: {
            id: args.id,
          },
        });
        return post;
      },
    });

    t.field("togglePublishPost", {
      type: "Post",
      args: {
        id: nonNull(intArg()),
        published: nonNull(booleanArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.update({
          where: { id: args.id },
          data: { published: args.published },
        });
        return post;
      },
    });

    t.field("deletePost", {
      type: "Post",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, args, context) => {
        const post = await context.prisma.post.delete({
          where: { id: args.id },
        });
        return post;
      },
    });
  },
});
