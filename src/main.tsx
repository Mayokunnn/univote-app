import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              border: "1px solid rgba(75, 85, 99, 0.3)",
            },
            className: "font-sans",
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
