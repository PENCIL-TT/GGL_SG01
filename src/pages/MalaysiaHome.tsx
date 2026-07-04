import React, { Suspense, lazy } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';
import MHero from '@/components/home/MHero';
import PQuickEnquiry from '@/components/home/PQuickEnquiry';
import SEO from '@/components/SEO';


const malaysiaNavPaths = {
  home: "/malaysia",
  about: "/malaysia/about",
  services: "/malaysia/services",
  careers: "/malaysia/careers",
  contact: "/malaysia/contact",
  globalPresence: "/malaysia/global-presence",
};

// Lazy load other components
const MAboutUs = lazy(() => import("@/components/home/MAboutUs"));
const MServices = lazy(() => import("@/components/home/MServices"));
const MGlobalPresence = lazy(() => import("@/components/home/MGlobalPresence"));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[100px]">
    <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
  </div>
);

const MalaysiaHome = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      <SEO />
      <Header navPaths={malaysiaNavPaths} />
      <main className="flex-grow pt-16">
        {/* Malaysia Hero */}
        <MHero />

        {/* About Malaysia section */}
        <Suspense fallback={<LoadingComponent />}>
          <MAboutUs
            learnMorePath="/malaysia/about"
            imageSrc="/oceanf.png"
          />
        </Suspense>

        {/* Malaysia services */}
        <Suspense fallback={<LoadingComponent />}>
          <MServices
            servicesPath="/malaysia/services"
            cardLinkPrefix="/malaysia/services"
            singleDestination
          />
        </Suspense>

        {/* Malaysia global presence block */}
        <Suspense fallback={<LoadingComponent />}>
          <MGlobalPresence linkPath="/malaysia/global-presence" />
        </Suspense>

        {/* Common enquiry form */}
        <Suspense fallback={<LoadingComponent />}>
          <PQuickEnquiry />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaHome;