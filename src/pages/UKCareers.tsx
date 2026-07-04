import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCareersPageSettings } from "@/lib/careers";
import SEO from '@/components/SEO';

const ukNavPaths = {
  home: "/uk",
  about: "/uk/about",
  services: "/uk/services",
  careers: "/uk/careers",
  contact: "/uk/contact",
  globalPresence: "/uk/global-presence",
};

const UKCareers = () => {
  const { data: content, isLoading } = useQuery({
    queryKey: ["careers-page", "UK"],
    queryFn: () => fetchCareersPageSettings("UK"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO />
        <Header navPaths={ukNavPaths} />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallbacks
  const heroTitle = content?.hero_title || "Careers at GGL UK";
  const heroSubtitle = content?.hero_subtitle || "Join our expanding team in London and help us deliver excellence in global logistics and supply chain solutions.";
  const opportunitiesTitle = content?.opportunities_title || "Current Opportunities";
  const opportunitiesDescription = content?.opportunities_description || "We are currently looking for talented individuals to join our UK operations.";
  const opportunitiesStatus = content?.opportunities_status || "";

  return (
    <>
      <SEO />
      <Header navPaths={ukNavPaths} />
      <main className="pt-24 pb-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-4">{heroTitle}</h1>
            <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              {heroSubtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 border border-gray-100">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-50 rounded-full">
                <Briefcase className="w-12 h-12 text-brand-navy" />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{opportunitiesTitle}</h2>
              <p className="text-gray-600 leading-relaxed">
                {opportunitiesDescription}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              {opportunitiesStatus && opportunitiesStatus !== "Career opportunities coming soon. Stay tuned!" ? (
                <div className="text-center text-gray-500 text-xl font-medium">{opportunitiesStatus}</div>
              ) : (
                /* Job Listing Placeholder Fallback */
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-brand-navy mb-2">Business Development Executive</h3>
                      <div className="flex items-center text-gray-500 text-sm gap-4">
                        <span className="flex items-center gap-1"><MapPin size={14} /> London, UK</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Full-time</span>
                      </div>
                      <p className="text-gray-600 mt-3 text-sm">
                        Drive growth in our UK market by identifying new business opportunities and building strong client relationships.
                      </p>
                    </div>
                    <Link to="/uk/contact">
                      <Button className="bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-colors w-full md:w-auto">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UKCareers;