import React from "react";
import { AuthContext, IAuthContext } from "./AuthContext";

export const useAuthContext = (): IAuthContext => {
  return React.useContext(AuthContext);
};
