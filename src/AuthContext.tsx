import React from "react";

export interface IAuthContext {
  authenticated: boolean;
  signOut: () => Promise<void>;
  getAuthToken: () => string | null;
  loginUser: () => void;
  authenticatedUserId: string | null;
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext
);
