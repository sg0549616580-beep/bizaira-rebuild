import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import LandingPage from "./pages/LandingPage";
import CreatePage from "./pages/CreatePage";
import PresentationStudioPage from "./pages/PresentationStudioPage";
import ProductPhotoStudioPage from "./pages/ProductPhotoStudioPage";
import AIMessagesPage from "./pages/AIMessagesPage";
import BusinessAnalyticsPage from "./pages/BusinessAnalyticsPage";
import TimeOptimizerPage from "./pages/TimeOptimizerPage";
import PricingStrategistPage from "./pages/PricingStrategistPage";
import ImageStudioPage from "./pages/ImageStudioPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import PricingPage from "./pages/PricingPage";
import SupportPage from "./pages/SupportPage";
import VideoStudioPage from "./pages/VideoStudioPage";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminPagesPage from "./pages/admin/AdminPagesPage";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminComponentsPage from "./pages/admin/AdminComponentsPage";
import AdminAIPage from "./pages/admin/AdminAIPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/admin/*" element={
                <AdminLayout>
                  <Routes>
                    <Route path="/pages" element={<AdminPagesPage />} />
                    <Route path="/media" element={<AdminMediaPage />} />
                    <Route path="/components" element={<AdminComponentsPage />} />
                    <Route path="/ai" element={<AdminAIPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/settings" element={<AdminSettingsPage />} />
                    <Route path="*" element={<AdminPagesPage />} />
                  </Routes>
                </AdminLayout>
              } />
              <Route path="*" element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/create/presentation" element={<PresentationStudioPage />} />
                    <Route path="/create/product-photos" element={<ProductPhotoStudioPage />} />
                    <Route path="/create/messages" element={<AIMessagesPage />} />
                    <Route path="/create/analytics" element={<BusinessAnalyticsPage />} />
                    <Route path="/create/time" element={<TimeOptimizerPage />} />
                    <Route path="/create/pricing" element={<PricingStrategistPage />} />
                    <Route path="/create/image-studio" element={<ImageStudioPage />} />
                    <Route path="/create/video" element={<VideoStudioPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;