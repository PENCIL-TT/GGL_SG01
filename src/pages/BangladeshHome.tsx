import { Suspense, lazy } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import BHero from "@/components/home/BHero";
import SEO from '@/components/SEO';

const bangladeshNavPaths = {
  home: "/bangladesh",
  about: "/bangladesh/about",
  services: "/bangladesh/services",
  careers: "/bangladesh/careers",
  contact: "/bangladesh/contact",
  globalPresence: "/bangladesh/global-presence",
};

// Lazy load other components
const BAboutUs = lazy(() => import("@/components/home/BAboutUs"));
const BServices = lazy(() => import("@/components/home/BServices"));
const BGlobalPresence = lazy(() => import("@/components/home/BGlobalPresence"));
const BQuickEnquiry = lazy(() => import("@/components/home/BQuickEnquiry"));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[100px]">
    <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
  </div>
);

const BangladeshHome = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Bangladesh-specific header with BD nav paths */}
      <SEO />
      <Header navPaths={bangladeshNavPaths} />

      <main className="flex-grow pt-16">
        {/* Bangladesh Hero */}
        <BHero />

        {/* About Bangladesh section */}
        <Suspense fallback={<LoadingComponent />}>
          <BAboutUs
            learnMorePath="/bangladesh/about"
            imageSrc="/lovable-uploads/1c085df7-9363-40dc-a724-ff004b473cac.png"
          />
        </Suspense>

        {/* Bangladesh services */}
        <Suspense fallback={<LoadingComponent />}>
          <BServices
            servicesPath="/bangladesh/services"
            cardLinkPrefix="/bangladesh/services"
            singleDestination
          />
        </Suspense>

        {/* Bangladesh global presence block */}
        <Suspense fallback={<LoadingComponent />}>
          <BGlobalPresence linkPath="/bangladesh/global-presence" />
        </Suspense>

        {/* Common enquiry form (can be used for BD as well) */}
        <Suspense fallback={<LoadingComponent />}>
          <BQuickEnquiry />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default BangladeshHome;
