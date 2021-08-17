import createError from "fastify-error";

export const NotAuthorized = createError(
  "FST_NOT_AUTHORIZED",
  "Not authorized to access this resource",
  401
);
