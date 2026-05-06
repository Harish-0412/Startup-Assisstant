import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import RAGPage from "@/pages/RAGPage";
import LocalInvestorsPage from "@/pages/LocalInvestorsPage";
import FundingPoliciesPage from "@/pages/FundingPoliciesPage";
import MarketAnalysisPage from "@/pages/MarketAnalysisPage";
import ActionPlansPage from "@/pages/ActionPlansPage";
import AIChatAssistant from "@/components/AIChatAssistant";
import PitchDeckAnalyzer from "@/pages/PitchDeckAnalyzer";
import CompetitiveAnalysisPage from "@/pages/CompetitiveAnalysisPage";
import { Dock } from "@/components/ui/Dock";
import { useEffect } from "react";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppRouter() {
  const { currentUser, loading } = useAuth();
  const { profile } = useApp();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (currentUser && !loading) {
      const allowedRoutesWithoutAssessment = ['/', '/rag', '/local-investors', '/funding-policies', '/market-analysis', '/action-plans', '/competitive-analysis'];
      
      // If user hasn't completed assessment and is trying to access dashboard/onboarding, redirect appropriately
      if (!profile.assessmentCompleted) {
        if (location === '/dashboard') {
          setLocation('/');
        }
        // Allow access to other routes without assessment
      }
      // If user completed assessment but is on onboarding page, go to dashboard
      else if (profile.assessmentCompleted && location === '/onboarding') {
        setLocation('/dashboard');
      }
    }
  }, [currentUser, loading, profile.assessmentCompleted, location, setLocation]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Login />;
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/rag" component={RAGPage} />
        <Route path="/local-investors" component={LocalInvestorsPage} />
        <Route path="/funding-policies" component={FundingPoliciesPage} />
        <Route path="/market-analysis" component={MarketAnalysisPage} />
        <Route path="/action-plans" component={ActionPlansPage} />
        <Route path="/pitch-deck-analyzer" component={PitchDeckAnalyzer} />
        <Route path="/competitive-analysis" component={CompetitiveAnalysisPage} />
      </Switch>
      <AIChatAssistant />
      <Dock />
    </div>
  );
}

export default App;
