/**
 * NOTE: This file needs to be loaded first.
 * Some library was loading the main .env and messing up the variables before they could be initialized
 */

export const SESSION_SECRET = get("SESSION_SECRET");
export const JWT_SECRET = get("JWT_SECRET");
export const REDIS_PASSWORD = get("REDIS_PASSWORD");
export const DOMAIN = get("DOMAIN");
export const BASE_URL = get("BASE_URL");

function get(variable: string): string {
  if (typeof process.env[variable] !== "string") {
    throw new TypeError(`Environmental variable ${variable} not provided`);
  }
  return process.env[variable] as string;
}

export const BCRYPT_SALT_ROUNDS = 10;
