import { Suspense, lazy } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import PHero from "@/components/home/PHero";
import SEO from '@/components/SEO';

const pakistanNavPaths = {
  home: "/pakistan",
  about: "/pakistan/about",
  services: "/pakistan/services",
  careers: "/pakistan/careers",
  contact: "/pakistan/contact",
  globalPresence: "/pakistan/global-presence",
};

// Lazy load other components
const PAboutUs = lazy(() => import("@/components/home/PAboutUs"));
const PServices = lazy(() => import("@/components/home/PServices"));
const PGlobalPresence = lazy(() => import("@/components/home/PGlobalPresence"));
const PQuickEnquiry = lazy(() => import("@/components/home/PQuickEnquiry"));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[100px]">
    <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
  </div>
);

const PakistanHome = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* pakistan-specific header with BD nav paths */}
      <SEO />
      <Header navPaths={pakistanNavPaths} />

      <main className="flex-grow pt-16">
        {/* pakistan Hero */}
        <PHero />

        {/* About pakistan section */}
        <Suspense fallback={<LoadingComponent />}>
          <PAboutUs
            learnMorePath="/pakistan/about"
            imageSrc="/Pabout.png"
          />
        </Suspense>

        {/* pakistan services */}
        <Suspense fallback={<LoadingComponent />}>
          <PServices
            servicesPath="/pakistan/services"
            cardLinkPrefix="/pakistan/services"
            singleDestination
          />
        </Suspense>

        {/* pakistan global presence block */}
        <Suspense fallback={<LoadingComponent />}>
          <PGlobalPresence linkPath="/pakistan/global-presence" />
        </Suspense>

        {/* Common enquiry form (can be used for BD as well) */}
        <Suspense fallback={<LoadingComponent />}>
          <PQuickEnquiry />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default PakistanHome;
