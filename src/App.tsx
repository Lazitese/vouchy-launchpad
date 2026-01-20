import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Collect from "./pages/Collect";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import EmbedWidget from "./pages/EmbedWidget";
import { ProtectedAdminRoute } from "./components/auth/ProtectedAdminRoute";
import AdminDashboard from "./pages/Admin/Index";
import AdminUsers from "./pages/Admin/Users";
import AdminUserDetail from "./pages/Admin/UserDetail";
import AdminWorkspaces from "./pages/Admin/Workspaces";
import AdminWorkspaceDetail from "./pages/Admin/WorkspaceDetail";
import AdminAnalytics from "./pages/Admin/Analytics";
import AdminSettings from "./pages/Admin/Settings";
import AdminPlans from "./pages/Admin/Plans";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/collect/:slug" element={<Collect />} />
              <Route path="/embed/:workspaceId" element={<EmbedWidget />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminUsers />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users/:userId"
                element={
                  <ProtectedAdminRoute>
                    <AdminUserDetail />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/workspaces"
                element={
                  <ProtectedAdminRoute>
                    <AdminWorkspaces />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/workspaces/:workspaceId"
                element={
                  <ProtectedAdminRoute>
                    <AdminWorkspaceDetail />
                  </ProtectedAdminRoute>
                }
              />


              <Route
                path="/admin/activity"
                element={
                  <ProtectedAdminRoute>
                    <AdminAnalytics />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/plans"
                element={
                  <ProtectedAdminRoute>
                    <AdminPlans />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettings />
                  </ProtectedAdminRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
