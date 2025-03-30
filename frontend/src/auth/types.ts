export type ResponseSession = {
  id: string;
  username: string;
  issuedAt: string;
  expiresAt: string;
};

export type AuthState = {
  user: ResponseSession | null;
  authenticated: boolean;
};

export type AuthContextValue = {
  user: ResponseSession | null;
  authenticated: boolean;
  checkUserSession: () => Promise<void>;
};
