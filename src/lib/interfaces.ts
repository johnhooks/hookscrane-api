import { Role } from "@prisma/client";

export type Maybe<T> = T | null;

export interface TokenPayload {
  sessionId: number;
}

export interface RefreshTokenPayload {
  sessionId: number;
  sessionToken: string;
}

export interface SessionData {
  user: {
    id: number;
    roles: Role[];
  };
  session: {
    id: number;
    token: string;
  };
}
