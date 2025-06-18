import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../config/toast";
import { Election } from "../types/election";
import { ethers } from "ethers";
import { API_ROUTES } from "../config/api";

// Retrieve address from localStorage
const userDataString = localStorage.getItem("userData");
let address: string | undefined;
if (userDataString) {
  try {
    const userData = JSON.parse(userDataString);
    address = userData.walletAddress;
  } catch {
    address = undefined;
  }
}

const API_BASE = API_ROUTES.ELECTION;

// Utility function for showing toast messages
export const showMessage = (message: string, isError = false) => {
  if (isError) {
    showToast.error(message);
  } else {
    showToast.success(message);
  }
  console[isError ? "error" : "log"](message);
};

// Core API Functions
const fetchElections = async () => {
  const response = await axios.post(`${API_BASE}/all`, { address });
  console.log(response.data);
  return response.data;
};

const fetchElectionStatus = async (electionId: number) => {
  const response = await axios.post(`${API_BASE}/status/${electionId}`, {
    address,
  });
  return response.data; // { started, ended }
};

const fetchCandidates = async (electionId: number) => {
  const response = await axios.post(`${API_BASE}/candidates/${electionId}`, {
    address,
  });
  return response.data; // Candidate[]
};

const fetchWinner = async (electionId: number) => {
  const response = await axios.post(`${API_BASE}/winner/${electionId}`, {
    address,
  });
  return response.data; // { winnerName, highestVotes }
};

const fetchVoterInfo = async (electionId: number, walletAddress: string) => {
  const response = await axios.post(
    `${API_BASE}/voters/${electionId}/${walletAddress}`,
    { address }
  );
  return response.data; // { hasVoted, votedCandidateId }
};

export const voteForCandidate = async ({
  electionId,
  candidateId,
  walletAddress,
}: {
  electionId: number;
  candidateId: number;
  walletAddress: string;
}) => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to vote in this election");
    }

    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];

    if (accounts?.length === 0) {
      throw new Error("Please connect your MetaMask wallet to vote");
    }

    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch {
      throw new Error("Please approve the MetaMask connection request to vote");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    // Verify walletAddress matches connected account
    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error(
        "The connected wallet address does not match your registered address. Please connect the correct wallet."
      );
    }

    // Create message hash exactly as the contract does
    const messageHash = ethers.keccak256(
      ethers.solidityPacked(
        ["uint256", "uint256", "address"],
        [electionId, candidateId, walletAddress]
      )
    );

    // Add Ethereum signed message prefix
    const ethSignedMessageHash = ethers.hashMessage(
      ethers.getBytes(messageHash)
    );

    // Sign the message hash with the Ethereum prefix
    let signature;
    try {
      signature = await signer.signMessage(ethers.getBytes(messageHash));
    } catch {
      throw new Error(
        "Please approve the signature request in MetaMask to complete your vote"
      );
    }

    console.log("Message hash:", messageHash);
    console.log("ETH signed message hash:", ethSignedMessageHash);
    console.log("Signature:", signature);

    // Send to backend
    const response = await axios.post(`${API_BASE}/vote`, {
      electionId,
      candidateId,
      address: walletAddress,
      signature,
    });

    return response.data;
  } catch (error) {
    console.error("Vote failed:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while processing your vote");
  }
};

const createElection = async ({
  title,
  type,
  allowedValues,
}: {
  title: string;
  type: string;
  allowedValues?: string[];
}) => {
  if (!title.trim()) {
    throw new Error("Please enter an election title");
  }
  if (!address) {
    throw new Error("User wallet address not found");
  }
  const response = await axios.post(`${API_BASE}/admin/elections`, {
    title,
    type,
    allowedValues,
    address,
  });
  console.log(response.data.election);
  return response.data.election; // Election
};

const addCandidate = async ({
  electionId,
  name,
}: {
  electionId: number;
  name: string;
}) => {
  if (!name.trim()) {
    throw new Error("Please enter a candidate name");
  }
  if (!address) {
    throw new Error("User wallet address not found");
  }
  const response = await axios.post(`${API_BASE}/admin/candidates`, {
    electionId,
    name,
    address,
  });
  return response.data.candidate; // Candidate
};

const startElection = async (electionId: number) => {
  if (!address) {
    throw new Error("User wallet address not found");
  }
  const response = await axios.post(`${API_BASE}/admin/start`, {
    electionId,
    address,
  });
  return response.data; // { message }
};

const endElection = async (electionId: number) => {
  if (!address) {
    throw new Error("User wallet address not found");
  }
  const response = await axios.post(`${API_BASE}/admin/end`, {
    electionId,
    address,
  });
  return response.data; // { message }
};

// React Query Hooks
export const useElections = () => {
  return useQuery({
    queryKey: ["elections"],
    queryFn: () => fetchElections(),
  });
};

export const useElectionStatus = (electionId: number) => {
  return useQuery({
    queryKey: ["electionStatus", electionId],
    queryFn: () => fetchElectionStatus(electionId),
    enabled: !!electionId,
  });
};

export const useCandidates = (electionId: number) => {
  return useQuery({
    queryKey: ["candidates", electionId],
    queryFn: () => fetchCandidates(electionId),
    enabled: !!electionId,
  });
};

export const useWinner = (electionId: number, isEnded: boolean) => {
  return useQuery({
    queryKey: ["winner", electionId],
    queryFn: () => fetchWinner(electionId),
    enabled: !!electionId && isEnded,
  });
};

export const useVoterInfo = (electionId: number, walletAddress: string) => {
  return useQuery({
    queryKey: ["voterInfo", electionId, walletAddress],
    queryFn: () => fetchVoterInfo(electionId, walletAddress),
    enabled: !!electionId && !!walletAddress,
  });
};

interface ElectionResponse {
  message: string;
  election: Election;
  txHash: string;
}

export const useCreateElection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createElection,
    onSuccess: (response: ElectionResponse) => {
      showToast.transaction("Election created succesfully", response.txHash);
      queryClient.invalidateQueries({ queryKey: ["elections"] });
      queryClient.setQueryData(["election", response.election.id], {
        ...response.election,
        transactionHash: response.txHash,
      });
    },
    onError: (error: AxiosError) => {
      showToast.error(error.message || "Failed to create election");
    },
  });
};

export const useAddCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCandidate,
    onSuccess: (candidate) => {
      showMessage("Candidate added successfully");
      queryClient.invalidateQueries({
        queryKey: ["candidates", candidate.electionId],
      });
    },
    onError: (error: AxiosError) => {
      showMessage(error.message || "Failed to add candidate", true);
    },
  });
};

export const useStartElection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startElection,
    onSuccess: (response: {
      message: string;
      electionId: number;
      txHash: string;
    }) => {
      showToast.transaction(response.message, response.txHash);
      queryClient.invalidateQueries({
        queryKey: ["electionStatus", response.electionId],
      });
    },
    onError: (error: AxiosError) => {
      showToast.error(error.message || "Failed to start election");
    },
  });
};

export const useEndElection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: endElection,
    onSuccess: (response: {
      message: string;
      electionId: number;
      txHash: string;
    }) => {
      showToast.transaction(response.message, response.txHash);
      queryClient.invalidateQueries({
        queryKey: ["electionStatus", response.electionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["winner", response.electionId],
      });
    },
    onError: (error: AxiosError) => {
      showToast.error(error.message || "Failed to end election");
    },
  });
};

export const useVoteForCandidate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voteForCandidate,
    onSuccess: (response: { message: string; txHash: string }) => {
      showToast.transaction(response.message, response.txHash);
      queryClient.invalidateQueries({ queryKey: ["voterInfo"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (error: Error) => {
      console.error("Vote error:", error);
      showToast.error(
        error.message || "Failed to cast vote. Please try again."
      );
    },
  });
};

// Utility Functions (Unchanged)
export const getElectionStatusText = (election: Election) => {
  if (election.isStarted && !election.isEnded) return "Active";
  if (election.isEnded) return "Ended";
  if (election.isNotStarted && !election.isEnded) return "Not Started";
};

export const getElectionStatusColor = (electionStatus: boolean) => {
  if (!electionStatus)
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  if (electionStatus)
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
};
