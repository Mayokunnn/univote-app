import { User } from "./user";

export interface WalletConnection {
    address: string;
    balance: string;
    chainId: number;
    connected: boolean;
  }
  
  export interface WalletConnectionResponse {
    success: boolean;
    address?: string;
    user?: User;
    error?: string;
  }