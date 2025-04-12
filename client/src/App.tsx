import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import AssessmentLevel1 from "@/pages/AssessmentLevel1";
import AssessmentLevel2 from "@/pages/AssessmentLevel2";
import GapAnalysis from "@/pages/GapAnalysis";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Layout from "@/components/Layout";

function Router() {
  const [location] = useLocation();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/assessment/level1" component={AssessmentLevel1} />
        <Route path="/assessment/level2" component={AssessmentLevel2} />
        <Route path="/gap-analysis" component={GapAnalysis} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
