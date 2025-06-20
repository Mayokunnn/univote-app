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

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.info("Transaction hash copied to clipboard");
  } catch {
    toast.error("Failed to copy to clipboard");
  }
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
    if (!hash) {
      toast.success(message, {
        className: toastStyles.success,
        icon: toastIcons.success,
        duration: 8000,
      });
      return;
    }

    const shortHash = `${hash.slice(0, 8)}...${hash.slice(-6)}`;

    toast.success(message, {
      className: toastStyles.success,
      icon: toastIcons.success,
      duration: 8000,
      description: `Tx: ${shortHash}`,
      action: {
        label: "Copy",
        onClick: () => copyToClipboard(hash),
      },
    });
  },
};
