import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import UKHero from "@/components/home/UKHero";
import UKAboutUs from "@/components/home/UKAboutUs";
import UKServices from "@/components/home/UKServices";
import UKGlobalPresence from "@/components/home/UKGlobalPresence";
import UKQuickEnquiry from "@/components/home/UKQuickEnquiry";
import SEO from '@/components/SEO';

const ukNavPaths = {
  home: "/uk",
  about: "/uk/about",
  services: "/uk/services",
  careers: "/uk/careers",
  contact: "/uk/contact",
  globalPresence: "/uk/global-presence",
};

const UKHome = () => {
  return (
    <>
      <SEO />
      <Header navPaths={ukNavPaths} />
      <UKHero />
      <UKAboutUs />
      <UKServices />
      <UKGlobalPresence />
      <UKQuickEnquiry />
      <Footer />
    </>
  );
};

export default UKHome;