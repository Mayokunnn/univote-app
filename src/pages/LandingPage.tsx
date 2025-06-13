import { FC, useState, useEffect } from "react";
import { ArrowRight, Shield, Users, BarChart, Zap, Link, Globe, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";

const BASE_URL = "http://localhost:5000";

const Web3LandingPage: FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const {connectWallet, login, currentUser} = useAuth(); // Assuming useAuth is a custom hook for authenticatio

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

const handleConnectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const response = await connectWallet();

      if (response?.success && response?.address) {
        const walletAddress = response?.address;

        const { data } = await axios.get(`${BASE_URL}/api/user/${walletAddress}`);

        if (data.success) {
          login({
            id: data.user.matricNumber,
            matricNumber: data.user.matricNumber,
            walletAddress: data.user.walletAddress,
            isAdmin: data.user.isAdmin,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          navigate("/dashboard");
        } else {
          navigate("/signup");
        }
      } else {
        setConnectionError(response?.error || "Failed to connect wallet");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectionError("Unexpected error occurred");
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Immutable Security",
      description: "Smart contracts ensure tamper-proof voting with cryptographic verification and decentralized consensus.",
      color: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/25"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "DAO Governance",
      description: "Decentralized autonomous organization principles with tokenized voting rights and community governance.",
      color: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/25"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "On-Chain Analytics",
      description: "Real-time blockchain data visualization with transparent vote counting and immutable audit trails.",
      color: "from-green-500 to-emerald-500",
      glow: "shadow-green-500/25"
    }
  ];

  const web3Features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Layer 2 scaling solutions for instant transactions"
    },
    {
      icon: <Link className="w-6 h-6" />,
      title: "Interoperable",
      description: "Cross-chain compatibility with major networks"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Decentralized",
      description: "No single point of failure or control"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero-Knowledge",
      description: "Privacy-preserving cryptographic proofs"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
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

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            {/* Web3 Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-300">Powered by Blockchain Technology</span>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              WEB3
              <br />
              <span className="text-white">ELECTIONS</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              The future of democratic participation is here. Secure, transparent, and decentralized student elections powered by blockchain technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting || !!currentUser}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50"
              >
                {isConnecting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Connecting to Web3...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Connect Wallet
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </button>
              
              <button className="px-8 py-4 border border-gray-600 rounded-xl font-semibold text-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300">
                View Demo
              </button>
            </div>

            {connectionError && (
              <div className="text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-lg p-3 max-w-md mx-auto">
                {connectionError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Web3 Features Grid */}
      <div className="relative z-10 py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {web3Features.map((feature, index) => (
              <div key={index} className="group">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Features */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Next-Gen Voting Infrastructure
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built on cutting-edge Web3 technologies for maximum security, transparency, and user empowerment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative p-8 rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm 
                  border border-gray-700/50 hover:border-gray-600/80 transition-all duration-500
                  hover:transform hover:scale-105 hover:shadow-2xl ${feature.glow}
                  ${hoveredCard === index ? 'border-opacity-100' : ''}
                `}>
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect Lines */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 py-20 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Four simple steps to participate in the future of democratic voting
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Connect Web3 Wallet",
                description: "Link your MetaMask, WalletConnect, or any Web3 wallet to securely access the platform with your digital identity.",
                tech: "MetaMask • WalletConnect • Coinbase Wallet"
              },
              {
                step: "02", 
                title: "Verify Identity",
                description: "Prove your eligibility through zero-knowledge proofs while maintaining complete privacy of your personal information.",
                tech: "Zero-Knowledge Proofs • Privacy-First Verification"
              },
              {
                step: "03",
                title: "Browse Smart Contracts",
                description: "Explore active elections deployed as smart contracts with full transparency and immutable voting logic.",
                tech: "Smart Contracts • Solidity • IPFS"
              },
              {
                step: "04",
                title: "Cast On-Chain Vote",
                description: "Submit your encrypted vote directly to the blockchain with cryptographic proof and instant global verification.",
                tech: "Blockchain Recording • Cryptographic Signatures"
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-8 p-8 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 mb-3 transition-colors">
                      {item.description}
                    </p>
                    <div className="text-sm text-blue-400 font-medium">
                      {item.tech}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Join the Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the first generation to experience truly decentralized, transparent, and secure digital democracy.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 disabled:opacity-50"
            >
              {isConnecting ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center">
                  Start Voting on Web3
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p className="mb-4">Powered by Ethereum • Built for the Future • Secured by Cryptography</p>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <span>🔐 End-to-End Encrypted</span>
            <span>⚡ Lightning Fast</span>
            <span>🌐 Globally Accessible</span>
            <span>🔗 Fully Decentralized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Web3LandingPage;