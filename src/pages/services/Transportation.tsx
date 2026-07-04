import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import SEO from '@/components/SEO';

const Transportation = () => {
  const { navPaths, isBangladesh, isPakistan, isUK, isMalaysia } = useCountryNavigation();
  const countryCode = isBangladesh ? "BD" : isPakistan ? "PK" : isUK ? "UK" : isMalaysia ? "MY" : "SG";

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/service-details/${countryCode}/transportation`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {});
  }, [countryCode]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                >
                  {data?.hero_title || "Transportation Solutions"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg text-gray-700 mb-6"
                >
                  {data?.hero_subtitle || "Reliable domestic and international transportation services"}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link
                    to={data?.cta_button_link || navPaths.contact}
                    className="px-6 py-3 bg-brand-gold hover:bg-amber-400 text-brand-navy font-medium rounded-md shadow-md transition-all"
                  >
                    {data?.cta_button_text || "Get a Quote"}
                  </Link>
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden shadow-xl"
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      alt="Transportation Service"
                      className="w-full h-full object-cover"
                      src={data?.hero_image_url || "/trucks.png"}
                    />
                  </AspectRatio>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                {data?.section1_title || "Comprehensive Transportation Services"}
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
              <p className="text-gray-700 mb-6 text-justify">
                {data?.section1_content || "GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence in every aspect of transportation and distribution, making us the dependable choice for your logistics needs."}
              </p>
            </div>
            
            {/* Features Section */}
            {data?.features_list && data.features_list.length > 0 && (
              <div className="max-w-3xl mx-auto mb-12 bg-white rounded-xl p-8 border border-slate-100 shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  {data.features_title || "Key Features"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.features_list.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-brand-navy to-blue-700 rounded-xl text-white p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-slate-50">{data?.cta_title || "Ready to Transport Your Cargo?"}</h3>
              <p className="mb-6 text-blue-50">
                Contact our team today for reliable transportation solutions.
              </p>
              <Link
                to={data?.cta_button_link || navPaths.contact}
                className="inline-block bg-white text-brand-navy px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                {data?.cta_button_text || "Get a Quote"}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Transportation;
