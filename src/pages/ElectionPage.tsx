/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  Check,
  Clock,
  Info,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Election, Candidate } from "../types/election";
import {
  useElections,
  useCandidates,
  useVoterInfo,
  useVoteForCandidate,
  showMessage,
} from "../api/elections.ts";

interface VoteConfirmationProps {
  candidate: Candidate;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const VoteConfirmation: FC<VoteConfirmationProps> = ({
  candidate,
  onConfirm,
  onCancel,
  isLoading,
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 max-w-md w-full transition-all duration-300">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
        Confirm Your Vote
      </h3>

      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-4">
          {candidate.image ? (
            <img
              src={candidate.image}
              alt={candidate.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <User size={32} className="text-white" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{candidate.name}</p>
          <p className="text-sm text-gray-400">{candidate.department}</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 mb-6">
        <div className="flex items-start">
          <Info size={20} className="text-yellow-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-yellow-300">
            Your vote will be permanently recorded on the blockchain and cannot
            be changed.
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 hover:border-gray-500/50 text-gray-300 hover:text-gray-200 transition-all duration-300"
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          onClick={onConfirm}
          className="flex-1 py-2 px-4 cursor-pointer rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className=" inset-0 w-6 h-6 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
            </div>
          ) : (
            "Confirm Vote"
          )}
        </button>
      </div>
    </div>
  </div>
);

const ElectionStatus: React.FC<{
  election: Election;
  candidates: Candidate[];
  voteSuccess: boolean;
}> = ({ election, candidates, voteSuccess }) => {
  const { currentUser } = useAuth();
  // Fetch voter info to check if user has voted
  const { data: voterInfo } = useVoterInfo(
    election?.id || 0,
    currentUser?.walletAddress || ""
  );
  return (
    <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 sticky top-6 hover:border-blue-500/50 transition-all duration-500">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
        Election Status
      </h2>
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Total Votes</span>
          <span className="font-medium text-white">{election.totalVotes}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Candidates</span>
          <span className="font-medium text-white">{candidates.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className="font-medium text-white">
            {election.isStarted && !election.isEnded && "Started"}
            {election.isEnded && "Ended"}
            {election.isNotStarted && "Not Started"}
          </span>
        </div>
        {election.transactionHash && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
            <span className="text-gray-400">Transaction</span>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-blue-300">
                {election.transactionHash.substring(0, 8)}...
                {election.transactionHash.substring(
                  election.transactionHash.length - 6
                )}
              </span>
              <a
                href={`https://sepolia.etherscan.io/tx/${election.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>

      {election.isStarted && !voterInfo?.hasVoted && currentUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 mb-4">
          <p className="text-sm text-blue-300">
            You are eligible to vote in this election. Review the candidates and
            cast your vote below.
          </p>
        </div>
      )}

      {voterInfo?.hasVoted && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 mb-4 flex items-start">
          <Check size={20} className="text-green-400 mr-2 mt-0.5" />
          <p className="text-sm text-green-300">
            You have already voted in this election. Your vote has been recorded
            on the blockchain.
          </p>
        </div>
      )}

      {voteSuccess && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/30 mb-4 flex items-start">
          <Check size={20} className="text-green-400 mr-2 mt-0.5" />
          <p className="text-sm text-green-300">
            Your vote has been successfully recorded! Thank you for
            participating.
          </p>
        </div>
      )}
    </div>
  );
};
const ElectionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [voteSuccess, setVoteSuccess] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch elections and find the matching one
  const {
    data: elections = [],
    isLoading: electionsLoading,
    isError: electionsError,
  } = useElections();

  // Fetch candidates for the election
  const {
    data: fetchedCandidates = [],
    isLoading: candidatesLoading,
    isError: candidatesError,
  } = useCandidates(election?.id || 0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setCandidates(fetchedCandidates);
  }, [fetchedCandidates]);

  // Fetch voter info to check if user has voted
  const { data: voterInfo, isError: voterInfoError } = useVoterInfo(
    election?.id || 0,
    currentUser?.walletAddress || ""
  );

  // Vote mutation
  const voteMutation = useVoteForCandidate();
  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Set election based on URL id
  useEffect(() => {
    if (elections.length > 0 && id) {
      const matchingElection = elections.find(
        (el: Election) => el.id.toString() === id
      );
      if (matchingElection) {
        setElection(matchingElection);
      } else {
        setElection(null);
      }
    }
  }, [elections, id]);

  // Handle errors
  useEffect(() => {
    if (electionsError) {
      showMessage("Failed to fetch elections", true);
    }
    if (candidatesError) {
      showMessage("Failed to fetch candidates", true);
    }
    if (voterInfoError) {
      showMessage("Failed to fetch voter information", true);
    }
  }, [electionsError, candidatesError, voterInfoError]);

  const handleVoteClick = (candidate: Candidate) => {
    if (!currentUser) {
      showMessage("Please connect your wallet to vote in this election", true);
      navigate("/signup");
      return;
    }

    if (!window.ethereum) {
      showMessage("Please install MetaMask to vote in this election", true);
      return;
    }

    if (voterInfo?.hasVoted) {
      showMessage(
        "You have already voted in this election. Each wallet can only vote once.",
        true
      );
      return;
    }

    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const handleConfirmVote = () => {
    if (!selectedCandidate || !election || !currentUser) {
      showMessage("Unable to process vote. Please try again.", true);
      return;
    }

    voteMutation.mutate(
      {
        electionId: election.id,
        candidateId: selectedCandidate.id,
        walletAddress: currentUser.walletAddress,
      },
      {
        onSuccess: () => {
          setVoteSuccess(true);
          setShowConfirmation(false);
          // Update candidate votes in UI optimistically
          setCandidates(
            candidates.map((c) =>
              c.id === selectedCandidate.id
                ? { ...c, voteCount: (c.voteCount || 0) + 1 }
                : c
            )
          );
          // Reset success state after 5 seconds
          setTimeout(() => {
            setVoteSuccess(false);
          }, 5000);
        },
        onError: (error: Error) => {
          showMessage(
            error.message || "Failed to submit your vote. Please try again.",
            true
          );
        },
        onSettled: () => {
          setShowConfirmation(false);
        },
      }
    );
  };

  const renderElectionStatus = () => {
    if (!election) return null;

    if (election.isNotStarted) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-500/30">
          <Clock size={18} className="text-yellow-400 mr-2" />
          <span className="text-yellow-300 font-medium">Upcoming</span>
        </div>
      );
    } else if (election.isEnded) {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-400/20 border border-gray-500/30">
          <Check size={18} className="text-gray-400 mr-2" />
          <span className="text-gray-300 font-medium">Ended</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
          <Clock size={18} className="text-green-400 mr-2" />
          <span className="text-green-300 font-medium">Active</span>
        </div>
      );
    }
  };

  if (electionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>
          <div
            className="absolute w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-300 blur-xl"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
          ></div>
        </div>
        <div className="relative z-10 text-center p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Election Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The election you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="py-2 px-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-300 blur-xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      <div className="relative z-10 pt-20 max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center cursor-pointer text-blue-400 hover:text-blue-300 mb-8 transition-colors duration-300"
        >
          <ChevronLeft
            size={20}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          <span>Back to Dashboard</span>
        </button>

        {/* Election Header */}
        <div className="relative rounded-3xl overflow-hidden mb-12 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
          {election.bannerImage ? (
            <img
              src={election.bannerImage}
              alt={election.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div
              className={`w-full h-64 bg-gradient-to-r ${
                election.type === "general"
                  ? "from-blue-600 to-cyan-600"
                  : election.type === "department"
                  ? "from-purple-500 to-pink-500"
                  : election.type === "program"
                  ? "from-orange-500 to-red-500"
                  : "from-gray-600 to-gray-500"
              }`}
            ></div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {election.title}
              </h1>
              <div className="flex items-center">{renderElectionStatus()}</div>
            </div>
          </div>
        </div>

        {/* Election Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                About This Election
              </h2>
              <p className="text-gray-400 mb-6">{election.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30">
                  <p className="text-sm text-gray-400">Election Type</p>
                  <p className="font-medium text-white capitalize">
                    {election.type}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30">
                  <p className="text-sm text-gray-400">Start Date</p>
                  <p className="font-medium text-white">
                    {election.startDate
                      ? new Date(election.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30">
                  <p className="text-sm text-gray-400">End Date</p>
                  <p className="font-medium text-white">
                    {election.endDate
                      ? new Date(election.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Current Results */}
              {election.isStarted && (
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <BarChart2 size={20} className="text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Current Results
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {candidates
                      .sort(
                        (a: Candidate, b: Candidate) =>
                          (b.voteCount || 0) - (a.voteCount || 0)
                      )
                      .map((candidate: Candidate) => (
                        <div key={candidate.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-300">
                              {candidate.name}
                            </span>
                            <span className="text-gray-300 font-medium">
                              {candidate.voteCount || 0} votes
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
                              style={{
                                width:
                                  candidate.voteCount && election.totalVotes
                                    ? `${(
                                        (candidate.voteCount /
                                          election.totalVotes) *
                                        100
                                      ).toFixed(2)}%`
                                    : "0%",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <ElectionStatus
              election={election}
              candidates={fetchedCandidates}
              voteSuccess={voteSuccess}
            />
          </div>
        </div>

        {/* Candidates Section */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Candidates
          </h2>
          {candidatesLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading candidates...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate: Candidate) => (
                <div
                  key={candidate.id}
                  className="group relative rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="h-48 flex items-center justify-center">
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="h-full w-full object-cover rounded-t-3xl"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center rounded-t-3xl">
                        <User size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl text-center font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 mb-1">
                      {candidate.name}
                    </h3>
                    {election &&
                      election.isStarted &&
                      !voterInfo?.hasVoted &&
                      currentUser &&
                      election?.allowedValues?.includes(
                        currentUser?.department || currentUser?.program
                      ) && (
                        <button
                          onClick={() => handleVoteClick(candidate)}
                          disabled={voteMutation.isPending}
                          className="w-full py-2 px-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Vote for {candidate.name.split(" ")[0]}
                        </button>
                      )}
                    {election && election.isEnded && (
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-center">
                        <p className="text-gray-400">Final Votes</p>
                        <p className="text-2xl font-bold text-white">
                          {candidate.voteCount || 0}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voting in Progress Modal */}
        {voteMutation.isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 max-w-md w-full text-center">
              <div className="relative mx-auto mb-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <h3 className="text-lg font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Recording Your Vote
              </h3>
              <p className="text-gray-400">
                Your vote is being securely recorded on the blockchain. Please
                do not close this page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vote Confirmation Modal */}
      {showConfirmation && selectedCandidate && (
        <VoteConfirmation
          candidate={selectedCandidate}
          onConfirm={handleConfirmVote}
          onCancel={() => setShowConfirmation(false)}
          isLoading={voteMutation?.isPending}
        />
      )}
    </div>
  );
};

export default ElectionPage;
