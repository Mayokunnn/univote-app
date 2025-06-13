import { FC, useState, useEffect } from "react";
import { Github, Twitter, Mail, Shield, Link as LinkIcon, Globe } from "lucide-react";

const Footer: FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialLinks = [
    { icon: Github, href: "#", label: "Github", color: "from-gray-500 to-gray-600" },
    { icon: Twitter, href: "#", label: "Twitter", color: "from-blue-500 to-cyan-500" },
    { icon: Mail, href: "mailto:support@UniVote.edu", label: "Email", color: "from-purple-500 to-pink-500" }
  ];

  const resourceLinks = [
    { title: "How it works", href: "/how-it-works" },
    { title: "FAQ", href: "/faq" },
    { title: "Support", href: "/support" },
    { title: "Documentation", href: "/docs" }
  ];

  return (
    <footer className="relative bg-black text-white border-t border-gray-800/50 mt-auto overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-green-600/10 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          ></div>
        </div>

        {/* Mouse Follow Effect */}
        <div 
          className="absolute w-48 h-48 bg-gradient-radial from-blue-500/5 to-transparent rounded-full pointer-events-none transition-all duration-500 blur-xl"
          style={{
            left: mousePosition.x - 96,
            top: mousePosition.y - 96
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                UniVote
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Secure and transparent student elections powered by blockchain technology and Web3 innovation.
            </p>
            
            {/* Web3 Features */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                { icon: Shield, text: "Secure" },
                { icon: Globe, text: "Decentralized" },
                { icon: LinkIcon, text: "Transparent" }
              ].map((feature, index) => (
                <div key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm">
                  <feature.icon className="w-3 h-3 mr-1 text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-3 group-hover:w-2 group-hover:bg-cyan-400 transition-all duration-300"></div>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Connect
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group relative p-3 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/80 transition-all duration-300 hover:transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50">
              <h4 className="text-sm font-semibold text-white mb-2">Stay Updated</h4>
              <p className="text-xs text-gray-400 mb-3">Get the latest Web3 voting updates</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-900/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-xs font-semibold text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; {new Date().getFullYear()} UniVote. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-4">
                <span>🔐 End-to-End Encrypted</span>
                <span>⚡ Lightning Fast</span>
                <span>🌐 Globally Accessible</span>
              </div>
            </div>
            
            {/* Blockchain Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Blockchain Network Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Glow Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </footer>
  );
};

export default Footer;