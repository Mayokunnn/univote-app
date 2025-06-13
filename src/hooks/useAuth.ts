import { createContext, useContext } from "react";
import { WalletConnectionResponse } from "../types/wallet";
import { User } from "../types/user";


export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  connectWallet: () => Promise<WalletConnectionResponse | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to access Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
