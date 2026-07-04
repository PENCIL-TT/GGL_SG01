import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { Warehouse, Package, Box, Shield, MapPin, Timer, Gauge, CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import SEO from '@/components/SEO';

const Warehousing = () => {
  const { navPaths, isBangladesh, isPakistan, isUK, isMalaysia } = useCountryNavigation();
  const countryCode = isBangladesh ? "BD" : isPakistan ? "PK" : isUK ? "UK" : isMalaysia ? "MY" : "SG";

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/service-details/${countryCode}/warehousing`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {});
  }, [countryCode]);

  const defaultFeatures = [
    {
      title: "Inventory Management",
      description: "Real-time tracking and management of your stock",
      icon: <Package className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Climate Control",
      description: "Temperature and humidity controlled storage",
      icon: <Gauge className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Order Fulfillment",
      description: "Complete pick, pack, and ship services",
      icon: <Box className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Security Systems",
      description: "24/7 monitoring and advanced security measures",
      icon: <Shield className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Location Tracking",
      description: "Real-time visibility of inventory location",
      icon: <MapPin className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Fast Processing",
      description: "Quick turnaround times for all operations",
      icon: <Timer className="h-5 w-5 text-brand-gold" />
    }
  ];

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
                  {data?.hero_title || "Warehousing Solutions"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg text-gray-700 mb-6"
                >
                  {data?.hero_subtitle || "Premier supply chain solutions for efficient storage and distribution"}
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
                      alt="Warehousing Service"
                      className="w-full h-full object-cover"
                      src={data?.hero_image_url || "/warehouse2.png"}
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
                {data?.section1_title || "Comprehensive Warehousing Services"}
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
              <p className="text-gray-700 mb-6 text-justify">
                {data?.section1_content || "GGL is a premier supply chain solutions provider, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and consumers (for finished products), and from consumers back to original equipment manufacturers (for spares and returns)."}
              </p>
              {!data && (
                <>
                  <p className="text-gray-700 mb-6 text-justify">Our state-of-the-art warehouses are tailored to meet clients' specific requirements and are supported by cutting-edge WMS systems. These systems offer complete visibility and advanced features such as online picking and reorder cycle notifications.</p>
                  <p className="text-gray-700 mb-6 text-justify">Our skilled warehouse team is highly experienced and trained to accommodate the unique needs of each client. They are backed by dedicated teams specializing in forwarding and land transportation.</p>
                </>
              )}
            </div>
            
            {/* Features Section */}
            {data?.features_list && data.features_list.length > 0 ? (
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
            ) : (
              /* Features Grid (Default Static) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {defaultFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="mb-3 bg-blue-50 p-2 rounded-full inline-block">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
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
              <h3 className="text-2xl font-bold mb-4 text-slate-50">{data?.cta_title || "Ready to Optimize Your Storage?"}</h3>
              <p className="mb-6 text-blue-50">
                Contact our team today for tailored warehousing solutions.
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

export default Warehousing;
