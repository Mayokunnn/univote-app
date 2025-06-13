import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import ElectionPage from "./pages/ElectionPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./pages/DashboardPage";

const queryClient = new QueryClient();
const App: FC = () => {
  const { currentUser } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/signup"
              element={
                !currentUser ? <SignUpPage /> : <Navigate to="/dashboard" />
              }
            />
            <Route
              path="/dashboard"
              element={
                currentUser ? <DashboardPage /> : <Navigate to="/signup" />
              }
            />

            <Route path="/election/:id" element={<ElectionPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
