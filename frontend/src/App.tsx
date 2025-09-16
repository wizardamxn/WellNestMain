import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { UserProvider } from "./hooks/useUserData";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/not-found";

// Import all feature components
import Chatbot from "./components/Chatbot";
import HealthCheckQuiz from "./components/HealthCheckQuiz";
import BookingSystem from "./components/BookingSystem";
import ResourceHub from "./components/ResourceHub";
import MoodMusic from "./components/MoodMusic";
import PeerSupport from "./components/PeerSupport";
import GirlsWellness from "./components/GirlsWellness";

// Features map
const featureRoutes: Record<string, React.ComponentType> = {
  chatbot: Chatbot,
  healthcheck: HealthCheckQuiz,
  booking: BookingSystem,
  resources: ResourceHub,
  music: MoodMusic,
  peer: PeerSupport,
  girls: GirlsWellness,
};

function FeaturePage({ params }: { params: { id: string } }) {
  const Component = featureRoutes[params.id];
  if (!Component) return <NotFound />;
  return <Component />;
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/features/:id" component={FeaturePage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
