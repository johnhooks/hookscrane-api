import createError from "fastify-error";

export const NotAuthorized = createError(
  "FST_NOT_AUTHORIZED",
  "Not authorized to access this resource",
  401
);

export const NotFound = createError("FST_NOT_FOUND", "Resource not found", 404);

export const LoginFailed = createError("FST_LOGIN_FAILED", "Login attempt failed", 401);
