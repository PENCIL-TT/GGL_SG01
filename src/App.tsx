
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import About from "./pages/About";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import GlobalPresence from "./pages/GlobalPresence";

// Lazy load admin dashboard
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// Lazy load sub-services
const AirFreight = lazy(() => import("./pages/services/AirFreight"));
const OceanFreight = lazy(() => import("./pages/services/OceanFreight"));
const Transportation = lazy(() => import("./pages/services/Transportation"));
const Warehousing = lazy(() => import("./pages/services/Warehousing"));
const LCLConsolidation = lazy(() => import("./pages/services/LCLConsolidation"));
const ProjectCargo = lazy(() => import("./pages/services/ProjectCargo"));
const LiquidTransportation = lazy(() => import("./pages/services/LiquidTransportation"));
const CustomsClearance = lazy(() => import("./pages/services/CustomsClearance"));

// Lazy load Bangladesh pages
const BangladeshHome = lazy(() => import("./pages/BangladeshHome"));
const BangladeshAbout = lazy(() => import("./pages/BangladeshAbout"));
const BangladeshServices = lazy(() => import("./pages/BangladeshServices"));
const BangladeshContact = lazy(() => import("./pages/BangladeshContact"));
const BangladeshGlobalPresence = lazy(() => import("./pages/BangladeshGlobalPresence"));

// Lazy load Pakistan pages
const PakistanHome = lazy(() => import("./pages/PakistanHome"));
const PakistanContact = lazy(() => import("./pages/PakistanContact"));
const PakistanAbout = lazy(() => import("./pages/PakistanAbout"));
const PakistanCareers = lazy(() => import("./pages/pakistancareers"));
const PakistanServices = lazy(() => import("./pages/PakistanServices"));
const PakistanGlobalPresence = lazy(() => import("./pages/PakistanGlobalPresence"));

// Lazy load UK pages
const UKHome = lazy(() => import("./pages/UKHome"));
const UKContact = lazy(() => import("./pages/UKContact"));
const UKAbout = lazy(() => import("./pages/UKAbout"));
const UKServices = lazy(() => import("./pages/UKServices"));
const UKGlobalPresence = lazy(() => import("./pages/UKGlobalPresence"));
const UKCareers = lazy(() => import("./pages/UKCareers"));

// Lazy load Malaysia pages
const MalaysiaHome = lazy(() => import("./pages/MalaysiaHome"));
const MalaysiaContact = lazy(() => import("./pages/MalaysiaContact"));
const MalaysiaAbout = lazy(() => import("./pages/MalaysiaAbout"));
const MalaysiaServices = lazy(() => import("./pages/MalaysiaServices"));
const MalaysiaGlobalPresence = lazy(() => import("./pages/MalaysiaGlobalPresence"));
const MalaysiaCareers = lazy(() => import("./pages/MalaysiaCareers"));
import { ScrollToTop } from "./components/common/ScrollToTop";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// App component as a regular function component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#031525]">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          }>
            <Routes>
            <Route path="/" element={<Index />} />
            {/* Redirect routes */}
            <Route path="/india" element={<Navigate to="/" replace />} />
            <Route path="/index" element={<Navigate to="/" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsOfUse />} />
            <Route path="/global-presence" element={<GlobalPresence />} />
            
            <Route path="/bangladesh" element={<BangladeshHome />} />
            <Route path="/bangladesh/home" element={<BangladeshHome />} />
            <Route path="/bangladesh/contact" element={<BangladeshContact />} />
            <Route path="/bangladesh/about" element={<BangladeshAbout />} />
            <Route path="/bangladesh/careers" element={<Careers />} />
            <Route
              path="/bangladesh/services"
              element={<BangladeshServices />}
            />
            <Route
              path="/bangladesh/global-presence"
              element={<BangladeshGlobalPresence />}
            />
            {/* Bangladesh Service Routes */}
            <Route path="/bangladesh/services/air-freight" element={<AirFreight />} />
            <Route path="/bangladesh/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/bangladesh/services/transportation" element={<Transportation />} />
            <Route path="/bangladesh/services/warehousing" element={<Warehousing />} />
            <Route path="/bangladesh/services/lcl-consolidation" element={<LCLConsolidation />} />
            <Route path="/bangladesh/services/project-cargo" element={<ProjectCargo />} />
            <Route path="/bangladesh/services/liquid-transportation" element={<LiquidTransportation />} />
            <Route path="/bangladesh/services/customs-clearance" element={<CustomsClearance />} />
            <Route path="/bangladesh/contact" element={<BangladeshContact />} />
           
            {/* Pakistan Routes */}
            <Route path="/pakistan" element={<PakistanHome />} />
            <Route path="/pakistan/about" element={<PakistanAbout />} />
            <Route path="/pakistan/services" element={<PakistanServices />} />
            <Route path="/pakistan/careers" element={<PakistanCareers />} />
            <Route path="/pakistan/contact" element={<PakistanContact />} />
            <Route path="/pakistan/global-presence" element={<PakistanGlobalPresence />} />

            {/* Pakistan Service Routes */}
            <Route path="/pakistan/services/air-freight" element={<AirFreight />} />
            <Route path="/pakistan/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/pakistan/services/transportation" element={<Transportation />} />
            <Route path="/pakistan/services/warehousing" element={<Warehousing />} />
            <Route path="/pakistan/services/lcl-consolidation" element={<LCLConsolidation />} />
            <Route path="/pakistan/services/project-cargo" element={<ProjectCargo />} />
            <Route path="/pakistan/services/liquid-transportation" element={<LiquidTransportation />} />
            <Route path="/pakistan/services/customs-clearance" element={<CustomsClearance />} />

            {/* UK Routes */}
            <Route path="/uk" element={<UKHome />} />
            <Route path="/uk/about" element={<UKAbout />} />
            <Route path="/uk/services" element={<UKServices />} />
            <Route path="/uk/contact" element={<UKContact />} />
            <Route path="/uk/global-presence" element={<UKGlobalPresence />} />
            <Route path="/uk/careers" element={<UKCareers />} />

            {/* UK Service Routes */}
            <Route path="/uk/services/air-freight" element={<AirFreight />} />
            <Route path="/uk/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/uk/services/transportation" element={<Transportation />} />
            <Route path="/uk/services/warehousing" element={<Warehousing />} />
            <Route path="/uk/services/lcl-consolidation" element={<LCLConsolidation />} />
            <Route path="/uk/services/project-cargo" element={<ProjectCargo />} />
            <Route path="/uk/services/liquid-transportation" element={<LiquidTransportation />} />
            <Route path="/uk/services/customs-clearance" element={<CustomsClearance />} />

            {/* Malaysia Routes */}
            <Route path="/malaysia" element={<MalaysiaHome />} />
            <Route path="/malaysia/home" element={<MalaysiaHome />} />
            <Route path="/malaysia/about" element={<MalaysiaAbout />} />
            <Route path="/malaysia/services" element={<MalaysiaServices />} />
            <Route path="/malaysia/contact" element={<MalaysiaContact />} />
            <Route path="/malaysia/global-presence" element={<MalaysiaGlobalPresence />} />
            <Route path="/malaysia/careers" element={<MalaysiaCareers />} />

            {/* Malaysia Service Routes */}
            <Route path="/malaysia/services/air-freight" element={<AirFreight />} />
            <Route path="/malaysia/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/malaysia/services/transportation" element={<Transportation />} />
            <Route path="/malaysia/services/warehousing" element={<Warehousing />} />
            <Route path="/malaysia/services/lcl-consolidation" element={<LCLConsolidation />} />
            <Route path="/malaysia/services/project-cargo" element={<ProjectCargo />} />
            <Route path="/malaysia/services/liquid-transportation" element={<LiquidTransportation />} />
            <Route path="/malaysia/services/customs-clearance" element={<CustomsClearance />} />

             <Route path="/admin" element={<AdminDashboard />} />
            {/* Service specific pages */}
            <Route path="/services/air-freight" element={<AirFreight />} />
            <Route path="/services/ocean-freight" element={<OceanFreight />} />
            <Route path="/services/transportation" element={<Transportation />} />
            <Route path="/services/warehousing" element={<Warehousing />} />
            <Route path="/services/lcl-consolidation" element={<LCLConsolidation />} />
            <Route path="/services/project-cargo" element={<ProjectCargo />} />
            <Route path="/services/liquid-transportation" element={<LiquidTransportation />} />
            <Route path="/services/customs-clearance" element={<CustomsClearance />} />
            <Route path="*" element={<Index  />} />
          </Routes>
          </Suspense>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider> 
  );
}

export default App;
