import { toast } from "sonner";
import React from "react";

// Custom toast styles
const toastStyles = {
  success:
    "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30",
  error:
    "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30",
  info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30",
  loading:
    "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30",
};

// Custom toast icons
const toastIcons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  loading: "⟳",
};

// Transaction Hash Display Component
const TransactionHash: React.FC<{ hash: string }> = ({ hash }) => (
  <div className="flex items-center space-x-2 text-sm text-blue-300 mt-2">
    <span className="font-mono">
      Tx: {hash.substring(0, 8)}...{hash.substring(hash.length - 6)}
    </span>
    <a
      href={`https://sepolia.etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 transition-colors"
    >
      View
    </a>
  </div>
);

// Custom toast function
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      className: toastStyles.success,
      icon: toastIcons.success,
      duration: 5000,
    });
  },
  error: (message: string) => {
    toast.error(message, {
      className: toastStyles.error,
      icon: toastIcons.error,
      duration: 5000,
    });
  },
  info: (message: string) => {
    toast(message, {
      className: toastStyles.info,
      icon: toastIcons.info,
      duration: 5000,
    });
  },
  loading: (message: string) => {
    toast.loading(message, {
      className: toastStyles.loading,
      icon: toastIcons.loading,
      duration: 5000,
    });
  },
  // Special Web3 transaction toast
  transaction: (message: string, hash?: string) => {
    toast.success(
      <div className="space-y-2">
        <p>{message}</p>
        {hash && <TransactionHash hash={hash} />}
      </div>,
      {
        className: toastStyles.success,
        icon: toastIcons.success,
        duration: 8000,
      }
    );
  },
};
