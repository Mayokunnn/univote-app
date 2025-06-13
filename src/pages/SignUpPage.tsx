import { FC, useState, useEffect, FormEvent } from "react";
import { Link, CheckCircle, AlertCircle, ArrowRight, Shield, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";

const BASE_URL = "http://localhost:5000";


const SignUpPage: FC = () => {
  const navigate = useNavigate();
  const [matricNumber, setMatricNumber] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);

  const { connectWallet, currentUser, login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.walletAddress) {
      // navigate("/dashboard");
      console.log("Would navigate to dashboard");
    }
  }, [currentUser]);

  const validateMatricNumber = (mn: string): boolean => {
    const regex = /^\d{2}[A-Z]{2}\d{6}$/;
    return regex.test(mn);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateMatricNumber(matricNumber)) {
      setError("Invalid matric number format. Should be like: 21CG029830");
      return;
    }

    setIsValidating(true);
    setTimeout(() => {
      setIsValidated(true);
      setIsValidating(false);
    }, 1500);
  };

const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await connectWallet();

      if (response?.success && response?.address) {
        const walletAddress = response?.address;

        const request = {
          walletAddress: walletAddress,
          matricNumber: matricNumber,

        }

        const { data } = await axios.post(`${BASE_URL}/api/user/register`, request);

        if (data.user) {
          login({
            id: data.user.matricNumber,
            matricNumber: data.user.matricNumber,
            walletAddress: data.user.walletAddress,
            isAdmin: data.user.isAdmin,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setWalletAddress(data.user.walletAddress);
          navigate("/dashboard");
        } else {
          navigate("/signup");
        }
      } else {
        setError(response?.error || "Failed to connect wallet");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError("Unexpected error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-8 pt-20 bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Animated Background - matching landing page */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        {/* Mouse Follow Gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full pointer-events-none transition-all duration-300 blur-xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Web3 Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">Secure Web3 Authentication</span>
          </div>

          {/* Logo */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            VERIFY & CONNECT
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Join the decentralized future of student governance with blockchain-powered identity verification.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative group">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/80 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="relative">
              {!isValidated ? (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="matricNumber" className="block text-sm font-semibold text-white mb-3">
                      Student ID (Matric Number)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="matricNumber"
                        name="matricNumber"
                        required
                        placeholder="e.g. 21CG029830"
                        value={matricNumber}
                        onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
                        className="w-full px-4 py-4 text-white placeholder-gray-400 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 backdrop-blur-sm hover:border-gray-500/70"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-cyan-500/0 hover:from-blue-500/5 hover:to-cyan-500/5 pointer-events-none transition-all duration-300"></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Format: 21CG029830 (no spaces)</p>
                  </div>

                  {error && (
                    <div className="flex items-center p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                      <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isValidating}
                    className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isValidating ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Validating ID...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Verify Student ID
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
                    <CheckCircle className="text-green-400 mr-3 h-6 w-6" />
                    <span className="text-green-300 font-semibold text-lg">Student ID Verified Successfully</span>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 rounded-full">Next Step</span>
                    </div>
                  </div>

                  {/* Web3 Connection Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Connect Web3 Wallet
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Connect your MetaMask wallet to complete blockchain verification and access the platform.
                      </p>
                    </div>

                    {walletAddress ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-gray-900/60 to-gray-800/30 rounded-2xl border border-gray-600/50">
                          <div className="flex items-center mb-2">
                            <Zap className="w-5 h-5 text-green-400 mr-2" />
                            <span className="text-sm font-semibold text-green-400">Wallet Connected</span>
                          </div>
                          <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
                        </div>
                        
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="group w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
                        >
                          <div className="flex items-center justify-center">
                            Continue to Dashboard
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Connecting to Web3...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Link className="mr-2 h-5 w-5" />
                            Connect MetaMask Wallet
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Hover Effect Lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Need help? Contact your institution's blockchain unit.
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4 text-sm text-gray-500">
            <span>🔐 Secure</span>
            <span>⚡ Fast</span>
            <span>🌐 Decentralized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;