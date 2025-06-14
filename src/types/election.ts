export type ElectionStatus = boolean;
export type ElectionType =
  | "General"
  | "Departmental"
  | "Residential"
  | "Program";

export interface Election {
  id: number;
  title: string;
  type: "General" | "Departmental" | "Residential" | "Program" | string;
  isStarted: boolean;
  isEnded: boolean;
  isNotStarted: boolean;
  startDate?: string;
  endDate?: string;
  description: string;
  totalVotes: number;
  bannerImage?: string;
  transactionHash?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Candidate {
  id: number;
  name: string;
  electionId: number;
  position: string;
  voteCount: number;
  image?: string;
  department: string;
  year: string;
  manifesto: string;
  walletAddress: string;
  candidateAddress: string;
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: number;
  electionId: number;
  candidateId: number;
  userId: string;
  walletAddress: string;
  timestamp: string;
  transactionHash: string;
}
