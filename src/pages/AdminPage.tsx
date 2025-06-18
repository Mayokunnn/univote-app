import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  Trophy,
  Shield,
  Clock,
  BarChart2,
  Vote,
  ExternalLink,
} from "lucide-react";
import { Candidate, Election } from "../types/election";
import {
  useElections,
  useCandidates,
  useCreateElection,
  useAddCandidate,
  useStartElection,
  useEndElection,
  useWinner,
  getElectionStatusText,
  showMessage,
} from "../api/elections";

const AdminActionCard: React.FC<{
  title: string;
  description: string;
  action: () => void;
  isLoading: boolean;
  txHash?: string;
  disabled: boolean;
}> = ({ title, description, action, isLoading, txHash, disabled }) => (
  <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
      {title}
    </h3>
    <p className="text-gray-400 mb-4">{description}</p>

    {txHash && (
      <div className="flex items-center space-x-2 text-sm text-blue-300 mb-4">
        <span className="font-mono">
          Tx: {txHash.substring(0, 8)}...{txHash.substring(txHash.length - 6)}
        </span>
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    )}

    <button
      onClick={action}
      disabled={isLoading || disabled}
      className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Processing...
        </div>
      ) : (
        title
      )}
    </button>
  </div>
);

export default function AdminPage() {
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newElectionTitle, setNewElectionTitle] = useState("");
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [electionType, setElectionType] = useState("general");
  const [allowedValues, setAllowedValues] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [txHashes, setTxHashes] = useState<{
    start?: string;
    end?: string;
  }>({});

  const departments = ["Computer and Information Science"];
  const programs = [
    "BSc Computer Science",
    "BSc Management and Information Science",
  ];

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch elections
  const {
    data: elections = [],
    isLoading: electionsLoading,
    isError: electionsError,
  } = useElections();

  // Fetch data for selected election
  const {
    data: candidates = [],
    isLoading: candidatesLoading,
    isError: candidatesError,
  } = useCandidates(selectedElection?.id || 0);

  const { data: winnerData, isLoading: winnerLoading } = useWinner(
    selectedElection?.id || 0,
    selectedElection?.isEnded || false
  );

  // Mutations
  const createElectionMutation = useCreateElection();
  const addCandidateMutation = useAddCandidate();
  const startElectionMutation = useStartElection();
  const endElectionMutation = useEndElection();

  // Set initial selected election
  useEffect(() => {
    if (elections.length > 0 && !selectedElection) {
      setSelectedElection(elections[0]);
    }
  }, [elections, selectedElection]);

  // Handle initial load
  useEffect(() => {
    if (!electionsLoading) {
      setIsInitialLoad(false);
    }
  }, [electionsLoading]);

  // Handle errors
  useEffect(() => {
    if (electionsError) {
      showMessage("Failed to fetch elections", true);
    }
    if (candidatesError) {
      showMessage("Failed to fetch candidates", true);
    }
  }, [electionsError, candidatesError]);

  const handleStartElection = () => {
    if (!selectedElection) return;
    startElectionMutation.mutate(selectedElection.id, {
      onSuccess: (response) => {
        setTxHashes((prev) => ({ ...prev, start: response.txHash }));
      },
    });
  };

  const handleEndElection = () => {
    if (!selectedElection) return;
    endElectionMutation.mutate(selectedElection.id, {
      onSuccess: (response) => {
        setTxHashes((prev) => ({ ...prev, end: response.txHash }));
      },
    });
  };

  if (electionsLoading && isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
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

      <div className="relative z-10 pt-20 max-w-8xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 mb-8 hover:border-blue-500/50 transition-all duration-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Web3 Election Dashboard
                </h1>
                <p className="text-gray-400">
                  Manage decentralized elections on the blockchain
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateElection(!showCreateElection)}
                className="group flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                New Election
              </button>
            </div>
          </div>
        </div>

        {/* Create Election Form */}
        {showCreateElection && (
          <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 mb-8 hover:border-blue-500/50 transition-all duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center">
              <Vote className="mr-2 text-blue-400" size={24} />
              Deploy New Election Contract
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createElectionMutation.mutate(
                  {
                    title: newElectionTitle,
                    type: electionType,
                    allowedValues,
                  },
                  {
                    onSuccess: () => {
                      setShowCreateElection(false);
                      setNewElectionTitle("");
                      setElectionType("general");
                      setAllowedValues([]);
                    },
                  }
                );
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-3">
                <select
                  value={electionType}
                  onChange={(e) => {
                    setElectionType(e.target.value);
                    setAllowedValues([]);
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                  disabled={createElectionMutation?.isPending}
                >
                  <option value="general">General</option>
                  <option value="department">Departmental</option>
                  <option value="program">Program</option>
                </select>
                <input
                  type="text"
                  value={newElectionTitle}
                  onChange={(e) => setNewElectionTitle(e.target.value)}
                  placeholder="Enter election title"
                  className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                  disabled={createElectionMutation?.isPending}
                />
              </div>
              {electionType === "department" && (
                <select
                  value={allowedValues[0] || ""}
                  onChange={(e) => setAllowedValues([e.target.value])}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-white"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              )}
              {electionType === "program" && (
                <select
                  value={allowedValues[0] || ""}
                  onChange={(e) => setAllowedValues([e.target.value])}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-white"
                >
                  <option value="">Select program</option>
                  {programs.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={
                    createElectionMutation.isPending ||
                    !newElectionTitle.trim() ||
                    (electionType !== "general" && allowedValues.length === 0)
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createElectionMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="inset-0 w-6 h-6 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Deploy Election
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateElection(false)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 hover:border-gray-500/50 text-gray-300 hover:text-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Elections Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center">
                <Vote className="mr-2 text-blue-400" size={24} />
                Smart Contracts
              </h2>
              {elections.length === 0 ? (
                <div className="text-center py-8">
                  <Vote className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-400 text-sm">
                    No election contracts deployed
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {elections.map((election: Election) => (
                    <div
                      key={election.id}
                      className={`group relative rounded-2xl p-3 bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        selectedElection?.id === election.id
                          ? "bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-500/50"
                          : ""
                      }`}
                      onClick={() => setSelectedElection(election)}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 text-sm">
                            {election.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {election.id.toString().slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {selectedElection ? (
              <>
                {/* Selected Election Header */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {selectedElection.title}
                      </h2>
                      <p className="text-gray-400 font-mono">
                        Contract ID:{" "}
                        {selectedElection.id.toString().slice(0, 8)}...
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                        selectedElection.isStarted && !selectedElection.isEnded
                          ? "from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300"
                          : "from-gray-500/20 to-gray-400/20 border border-gray-500/30 text-gray-300"
                      }`}
                    >
                      {getElectionStatusText(selectedElection)}
                    </span>
                  </div>
                </div>

                {/* Election Control Panel */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                      <Clock className="mr-2 text-blue-400" size={24} />
                      Contract Control
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <AdminActionCard
                      title="Start Election"
                      description="Begin the election process and allow voters to cast their votes."
                      action={handleStartElection}
                      isLoading={startElectionMutation.isPending}
                      txHash={txHashes.start}
                      disabled={selectedElection?.isStarted || candidates}
                    />
                    <AdminActionCard
                      title="End Election"
                      description="Conclude the election and calculate the final results."
                      action={handleEndElection}
                      isLoading={endElectionMutation.isPending}
                      txHash={txHashes.end}
                      disabled={selectedElection?.isEnded || !selectedElection?.isStarted}
                    />
                  </div>
                  {!selectedElection.isStarted && candidates.length === 0 && (
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      Register at least one candidate before activating
                    </p>
                  )}
                </div>

                {/* Add Candidate Form */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center">
                    <Plus className="mr-2 text-blue-400" size={24} />
                    Register New Candidate
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addCandidateMutation.mutate(
                        {
                          electionId: selectedElection.id,
                          name: newCandidateName,
                        },
                        {
                          onSuccess: () => {
                            setNewCandidateName("");
                          },
                        }
                      );
                    }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={newCandidateName}
                      onChange={(e) => setNewCandidateName(e.target.value)}
                      placeholder="Enter candidate name"
                      disabled={
                        selectedElection.isStarted ||
                        addCandidateMutation.isPending
                      }
                      className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={
                        addCandidateMutation.isPending ||
                        selectedElection.isStarted ||
                        !newCandidateName.trim()
                      }
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addCandidateMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="inset-0 w-6 h-6 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin animate-reverse"></div>
                        </div>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Register Candidate
                        </>
                      )}
                    </button>
                  </form>
                  {selectedElection.isStarted && (
                    <p className="text-sm text-gray-400 mt-3">
                      Candidates cannot be registered after voting starts
                    </p>
                  )}
                </div>

                {/* Candidates List */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                      <Users className="mr-2 text-blue-400" size={24} />
                      Registered Candidates
                    </h2>
                    <span className="text-sm bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-500/30 text-blue-300 py-1 px-3 rounded-full">
                      {candidates.length} Registered
                    </span>
                  </div>
                  {candidatesLoading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-400 mt-2">
                        Loading candidates...
                      </p>
                    </div>
                  ) : candidates.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-400 text-lg">
                        No candidates registered
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Register your first candidate above
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {candidates.map((candidate: Candidate) => (
                        <div
                          key={candidate.id}
                          className="group relative rounded-2xl p-4 bg-gradient-to-br from-gray-800/40 to-gray-700/20 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  #
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                                  {candidate.name}
                                </h3>
                                {candidate.candidateAddress && (
                                  <p className="text-sm text-gray-400 font-mono">
                                    {candidate.candidateAddress.slice(0, 6)}...
                                    {candidate.candidateAddress.slice(-4)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-sm">
                                <BarChart2
                                  size={16}
                                  className="text-blue-400"
                                />
                                <span className="text-white font-medium">
                                  {candidate?.voteCount || 0}
                                </span>
                                <span className="text-gray-400">votes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700 p-12 text-center hover:border-blue-500/50 transition-all duration-500">
                <Vote className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                  No Contract Selected
                </h2>
                <p className="text-gray-400 mb-6">
                  Deploy a new election contract or select an existing one
                </p>
                <button
                  onClick={() => setShowCreateElection(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  Deploy First Election
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {selectedElection && (
              <>
                {/* Winner Display */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-500">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-4 flex items-center">
                    <Trophy className="mr-2 text-yellow-400" size={24} />
                    Election Winner
                  </h2>
                  {winnerLoading ? (
                    <div className="text-center py-6">
                      <div className="w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-400 mt-2">Loading winner...</p>
                    </div>
                  ) : selectedElection.isStarted &&
                    !selectedElection.isEnded ? (
                    <div className="text-center py-6">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-400">
                        Election must be finalized
                      </p>
                    </div>
                  ) : winnerData?.winnerName ? (
                    <div className="text-center py-6">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                      <p className="text-white font-medium">
                        {winnerData.winnerName}
                      </p>
                      <p className="text-gray-400">
                        {winnerData.highestVotes} votes
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-400">No winner determined</p>
                    </div>
                  )}
                </div>

                {/* Election Timeline */}
                <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 hover:border-blue-500/50">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                    Contract Timeline
                  </h2>
                  <div className="space-y-4">
                    <div
                      className={`flex items-center gap-3 ${
                        selectedElection.isNotStarted
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedElection.isNotStarted
                            ? "bg-blue-400"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">Setup Phase</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 ${
                        selectedElection.isStarted && !selectedElection.isEnded
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedElection.isStarted &&
                          !selectedElection.isEnded
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">Voting Active</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 ${
                        selectedElection.isEnded
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedElection.isEnded
                            ? "bg-blue-600"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">
                        Results Available
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Elections Overview */}
            <div className="rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-500">
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Contracts Overview
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Contracts</span>
                  <span className="font-medium text-white">
                    {elections.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Contracts</span>
                  <span className="font-medium text-green-400">
                    {
                      elections.filter(
                        (e: Election) => e.isStarted && !e.isEnded
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Finalized Contracts</span>
                  <span className="font-medium text-gray-300">
                    {elections.filter((e: Election) => e.isEnded).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
