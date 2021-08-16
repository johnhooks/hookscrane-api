export type Maybe<T> = T | null;

export interface TokenPayload {
  sessionId: number;
}

export interface SessionData {
  user: {
    id: number;
    roles: number;
  };
  session: {
    id: number;
  };
}
