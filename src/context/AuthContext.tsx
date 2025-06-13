import { useState, useEffect, FC, ReactNode } from "react";
import { ethers } from "ethers";
import { User } from "../types/user";
import { WalletConnectionResponse } from "../types/wallet";
import { AuthContext } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate

declare global {
  interface Window {
    ethereum?: import("@metamask/providers").MetaMaskInpageProvider;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    console.log("AuthContext currentUser:", currentUser);
    console.log("AuthContext loading:", loading);
  }, [currentUser, loading]);

  useEffect(() => {
    const hydrateUser = async () => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    hydrateUser();
  }, []);

  // Check admin access on route change
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      if (location.pathname.includes("/admin") && !user.isAdmin) {
        navigate("/"); // Redirect to home if not admin
      }
    }
    setLoading(false);
  }, [location.pathname, navigate]);

  const login = (userData: User): void => {
    setCurrentUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = async (): Promise<void> => {
    try {
      setCurrentUser(null);
      localStorage.removeItem("userData");

      if (window.ethereum && window.ethereum.request) {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      }

      navigate("/"); // Use navigate instead of window.location
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const connectWallet = async (): Promise<WalletConnectionResponse> => {
    try {
      if (!window.ethereum)
        return { success: false, error: "MetaMask not installed" };

      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts?.length > 0) {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
        await window.ethereum.request({ method: "eth_requestAccounts" });
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      return { success: true, address };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, connectWallet, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};