export interface User {
    id: string;
    matricNumber: string;
    walletAddress: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
export interface UserVoteHistory {
  id: number;
  election: string;
  candidate: string;
  date: string;
  transactionHash: string;
}
