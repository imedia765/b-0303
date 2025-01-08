import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useAuthSession } from "@/hooks/useAuthSession";
import ProtectedRoutes from "@/components/routing/ProtectedRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  const { session, loading } = useAuthSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dashboard-dark">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <BrowserRouter basename="/">
      <ProtectedRoutes session={session} />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;