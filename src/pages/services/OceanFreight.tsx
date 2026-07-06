import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { Ship, Layers, FileCheck, Calendar, MapPin, CheckCircle } from "lucide-react";
import SEO from '@/components/SEO';

const OceanFreight = () => {
  const { navPaths, isBangladesh, isPakistan, isUK, isMalaysia } = useCountryNavigation();
  const countryCode = isBangladesh ? "BD" : isPakistan ? "PK" : isUK ? "UK" : isMalaysia ? "MY" : "SG";

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/service-details/${countryCode}/ocean-freight`)
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
      title: "Full Container Load (FCL)",
      description: "Dedicated container shipments for larger volumes with direct routing.",
      icon: <Ship className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Less than Container Load (LCL)",
      description: "Cost-effective shared container shipping for smaller cargo volumes.",
      icon: <Layers className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Customs Brokerage & Clearance",
      description: "Expert handling of import/export documentation and border regulations.",
      icon: <FileCheck className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "Weekly Scheduled Sailings",
      description: "Consistent departure times on major global sea routes for reliable planning.",
      icon: <Calendar className="h-5 w-5 text-brand-gold" />
    },
    {
      title: "End-to-End Tracking",
      description: "Real-time visibility and status updates for ocean shipments.",
      icon: <MapPin className="h-5 w-5 text-brand-gold" />
    }
  ];

  const defaultSection1Content = `GGL’s dedicated ocean freight department specializes in complete freight management services for LCL and FCL loads, supported by a reliable global partner network, offering efficient collection, storage, and delivery from shipper to consignee with customs brokerage.

GGL provides scheduled and multiple services connecting global economies. Our dedicated carrier pricing team offers customized solutions based on client-specific transit and pricing needs.

Clients receive shipment milestone notifications through a customizable notification system, reducing unnecessary communication.`;

  // Determine which features to display
  const displayFeatures = data?.features_list && data.features_list.length > 0
    ? data.features_list.map((featTitle: string) => {
        const found = defaultFeatures.find(f => f.title.toLowerCase().includes(featTitle.toLowerCase()) || featTitle.toLowerCase().includes(f.title.toLowerCase()));
        return {
          title: featTitle,
          description: found?.description || "Professional ocean freight and maritime transport solutions.",
          icon: found?.icon || <CheckCircle className="h-5 w-5 text-brand-gold" />
        };
      })
    : defaultFeatures;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Text Section */}
              <div className="md:w-1/2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                >
                  {data?.hero_title || "Ocean Freight Solutions"}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-lg text-gray-700 mb-6"
                >
                  {data?.hero_subtitle || "Connecting you globally with comprehensive ocean freight services"}
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

              {/* Image Section */}
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden shadow-xl"
                >
                  <AspectRatio ratio={16 / 9}>
                    <img
                      alt="Ocean Freight Service"
                      src={data?.hero_image_url || "/lovable-uploads/2505b196-c548-4e6f-b9af-68ce9c9dff10.png"}
                      className="w-full h-full object-cover"
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
                {data?.section1_title || "Comprehensive Ocean Freight Services"}
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-8" />
              <p className="text-gray-700 mb-6 text-justify whitespace-pre-wrap leading-relaxed">
                {data?.section1_content || defaultSection1Content}
              </p>
            </div>

            {/* Features Section */}
            <div className="max-w-5xl mx-auto mb-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {data?.features_title || "Key Features"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayFeatures.map((feature, index) => (
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
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-brand-navy to-blue-700 rounded-xl text-white p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-slate-50">{data?.cta_title || "Ready to Ship Your Cargo?"}</h3>
              <p className="mb-6 text-blue-50">
                Contact our team today for tailored ocean freight solutions.
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

export default OceanFreight;
