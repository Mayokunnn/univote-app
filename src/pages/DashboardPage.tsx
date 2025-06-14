import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  User,
  Calendar,
  PlusCircle,
  Vote,
  FileText,
  BarChart2,
  ExternalLink,
  Zap,
  Wallet,
  Shield,
  Users,
} from "lucide-react";
import { Election } from "../types/election";
import { UserVoteHistory } from "../types/user";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { API_ROUTES } from "../config/api";

const ElectionCard: React.FC<{ election: Election }> = ({ election }) => (
  <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          {election.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">{election.description}</p>
      </div>
      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
        <span className="text-sm font-medium text-green-300">Active</span>
      </div>
    </div>

    {election.transactionHash && (
      <div className="flex items-center space-x-2 text-sm text-blue-300 mb-4">
        <span className="font-mono">
          Tx: {election.transactionHash.substring(0, 8)}...
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
    )}

    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center text-sm text-gray-400">
        <Users size={14} className="mr-1" />
        {election.totalVotes} votes
      </div>
      <Link
        to={`/election/${election.id}`}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 border border-blue-500/30 hover:border-blue-400/50 text-white hover:scale-105 transition-all duration-300"
      >
        View Election
      </Link>
    </div>
  </div>
);

const DashboardPage: FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { currentUser } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [voteHistory] = useState<UserVoteHistory[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchElections = useCallback(async () => {
    try {
      const address = currentUser?.walletAddress;
      const response = await axios.post(`${API_ROUTES.ELECTION}/all`, {
        address,
      });
      const data = await response.data;

      if (!Array.isArray(data)) {
        throw new Error("Expected an array of elections");
      }

      setElections(data);
      setLoading(false);
      setIsInitialLoad(false);

      if (data.length > 0 && !selectedElection) {
        setSelectedElection(data[0]);
      }
    } catch (err) {
      console.error("Error fetching elections:", err);
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [currentUser?.walletAddress, selectedElection]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchElections();
    };
    fetchData();
  }, [fetchElections]);

  const activeElections = elections.filter((e) => e.isStarted && !e.isEnded);
  const upcomingElections = elections.filter((e) => e.isNotStarted);
  const pastElections = elections.filter((e) => e.isEnded);

  if (loading && isInitialLoad) {
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
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/10 to-green-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid Pattern */}
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

        {/* Mouse Follow Gradient */}
        <div
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-300 blur-xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
      </div>

      <div className="relative z-10  pt-20 max-w-7xl mx-auto px-6 py-12">
        {/* User Welcome Section */}
        <div className="mb-12">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet size={32} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {currentUser?.matricNumber}
                </h1>
                <div className="flex items-center text-gray-400">
                  <Shield size={16} className="mr-2 text-blue-400" />
                  <span className="font-mono text-sm">
                    {currentUser?.walletAddress.substring(0, 8)}...
                    {currentUser?.walletAddress.substring(
                      currentUser?.walletAddress.length - 6
                    )}
                  </span>
                  <button className="ml-3 text-blue-400 hover:text-blue-300 transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Network Status</div>
                <div className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Active Elections */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  <Vote className="mr-3 text-green-400" size={32} />
                  Active Elections
                </h2>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
                  <div className="flex items-center text-green-300">
                    <Zap size={16} className="mr-2" />
                    <span className="font-medium">
                      {activeElections.length} Live
                    </span>
                  </div>
                </div>
              </div>

              {activeElections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeElections.map((election) => (
                    <ElectionCard key={election.id} election={election} />
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Vote size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    No active elections at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Elections */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <Calendar className="mr-3 text-purple-400" size={32} />
                  Upcoming Elections
                </h2>
              </div>

              {upcomingElections.length > 0 ? (
                <div className="space-y-4">
                  {upcomingElections.map((election) => (
                    <div
                      key={election.id}
                      className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                      onClick={() => navigate(`/election/${election.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 mb-2">
                            {election.title}
                          </h3>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {election.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full capitalize mb-3 ${
                              election.type === "general"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : election.type === "department"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            }`}
                          >
                            {election.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    No upcoming elections scheduled.
                  </p>
                </div>
              )}
            </div>

            {/* Past Elections */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold flex items-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <Calendar className="mr-3 text-purple-400" size={32} />
                  Past Elections
                </h2>
              </div>

              {pastElections.length > 0 ? (
                <div className="space-y-4">
                  {pastElections.map((election) => (
                    <div
                      key={election.id}
                      className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
                      onClick={() => navigate(`/election/${election.id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 mb-2">
                            {election.title}
                          </h3>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                            {election.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end ml-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full capitalize mb-3 ${
                              election.type === "general"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : election.type === "department"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            }`}
                          >
                            {election.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    No upcoming elections scheduled.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Quick Actions
              </h2>

              <div className="space-y-4">
                {/* Register as Candidate Button */}
                <button
                  className="group w-full p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105"
                  onClick={() => navigate("/candidate-registration")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <PlusCircle size={20} className="text-white" />
                      </div>
                      <span className="font-medium text-blue-300 group-hover:text-blue-200 transition-colors">
                        Register as Candidate
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-blue-400 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>

                {/* View Results Button */}
                <button
                  className="group w-full p-4 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-700/20 backdrop-blur-sm border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:transform hover:scale-105"
                  onClick={() => navigate("/results")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <BarChart2 size={20} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-300 group-hover:text-gray-200 transition-colors">
                        View All Results
                      </span>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-400 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>

                {/* Admin Panel Button (if user is admin) */}
                {currentUser?.isAdmin && (
                  <button
                    className="group w-full p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
                    onClick={() => navigate("/admin")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <User size={20} className="text-white" />
                        </div>
                        <span className="font-medium text-purple-300 group-hover:text-purple-200 transition-colors">
                          Admin Panel
                        </span>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-purple-400 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Voting History */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Voting History
              </h2>

              {voteHistory.length > 0 ? (
                <div className="space-y-4">
                  {voteHistory.map((vote) => (
                    <div
                      key={vote.id}
                      className="group p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 backdrop-blur-sm border-l-4 border-green-500 hover:bg-green-900/30 transition-all duration-300"
                    >
                      <p className="font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                        {vote.election}
                      </p>
                      <p className="text-sm text-gray-400 mb-2">
                        Voted for:{" "}
                        <span className="text-green-400 font-medium">
                          {vote.candidate}
                        </span>
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(vote.date).toLocaleDateString()}</span>
                        <a
                          href={`https://etherscan.io/tx/${vote.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="mr-1">View on Chain</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2 text-lg">
                    No voting history yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Your voting history will appear here after you've
                    participated in an election.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
