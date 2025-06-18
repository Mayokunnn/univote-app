export interface User {
  id: string;
  matricNumber: string;
  walletAddress: string;
  isAdmin: boolean;
  program: string ;
  department: string ;
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
