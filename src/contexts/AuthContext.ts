import { createContext } from "react";

export const AuthContext = createContext<
  | {
      token: string | null;
      login: (username: string, password: string) => Promise<void>;
      logout: () => void;
      isAuthenticated: boolean;
    }
  | undefined
>(undefined);
