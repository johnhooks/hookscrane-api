/**
 * NOTE: This file needs to be loaded first.
 * Some library was loading the main .env and messing up the variables before they could be initialized
 */

const variables = ["SESSION_SECRET", "JWT_SECRET", "DOMAIN", "BASE_URL"];

for (const variable of variables) {
  if (typeof process.env[variable] !== "string") {
    throw new TypeError(`Environmental variable ${variable} not provided`);
  }
}

export const SESSION_SECRET = process.env.SESSION_SECRET as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;

export const DOMAIN = process.env.DOMAIN as string;
export const BASE_URL = process.env.BASE_URL as string;
