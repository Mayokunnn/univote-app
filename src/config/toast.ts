import { toast } from "sonner";

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
    const content = hash
      ? `${message}\nTx: ${hash.substring(0, 8)}...${hash.substring(
          hash.length - 6
        )}`
      : message;

    toast.success(content, {
      className: toastStyles.success,
      icon: toastIcons.success,
      duration: 8000,
    });
  },
};
