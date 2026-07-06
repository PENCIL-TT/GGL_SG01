import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { Droplets, Truck, BarChart, ShieldCheck, CheckCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

interface LiquidTransportationProps {
  title?: string;
}

const LiquidTransportation: React.FC<LiquidTransportationProps> = ({
  title: initialTitle = "Liquid Transportation"
}) => {
  const { navPaths, isBangladesh, isPakistan, isUK, isMalaysia } = useCountryNavigation();
  const countryCode = isBangladesh ? "BD" : isPakistan ? "PK" : isUK ? "UK" : isMalaysia ? "MY" : "SG";

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/service-details/${countryCode}/liquid-transportation`)
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
      title: "Specialized Equipment",
      description: "ISO tanks, flexitanks, and specialized tankers for all cargo types",
      icon: <Droplets className="h-10 w-10 text-brand-gold" />
    },
    {
      title: "End-to-End Logistics",
      description: "Complete solutions from planning to delivery",
      icon: <Truck className="h-10 w-10 text-brand-gold" />
    },
    {
      title: "Temperature Control",
      description: "Maintain optimal conditions for sensitive cargo",
      icon: <BarChart className="h-10 w-10 text-brand-gold" />
    },
    {
      title: "Safety First",
      description: "Strict protocols and trained personnel handle your cargo",
      icon: <ShieldCheck className="h-10 w-10 text-brand-gold" />
    }
  ];

  const defaultSection1Content = `Transporting liquid cargo demands specialized expertise, and we provide comprehensive solutions ensuring the safe and efficient delivery of your valuable cargo. Understanding the unique challenges of liquid transport, whether chemicals, food-grade products, or other bulk items, we utilize a specialized fleet and equipment, including ISO tanks, flexitanks, and specialized tankers, managed by a team trained in strict safety protocols.

We offer end-to-end logistics, encompassing pre-shipment planning, route optimization, regulatory compliance, temperature-controlled transportation for sensitive cargo, secure loading/unloading, and real-time tracking. Our commitment to safety and reliability guarantees your cargo arrives in perfect condition and on time, making us a trusted partner for both domestic and international transportation needs.`;

  // Determine features to display
  const displayFeatures = data?.features_list && data.features_list.length > 0
    ? data.features_list.map((featTitle: string) => {
        const found = defaultFeatures.find(f => f.title.toLowerCase().includes(featTitle.toLowerCase()) || featTitle.toLowerCase().includes(f.title.toLowerCase()));
        return {
          title: featTitle,
          description: found?.description || "Safe and compliant bulk liquid transportation solutions.",
          icon: found?.icon || <CheckCircle className="h-10 w-10 text-brand-gold" />
        };
      })
    : defaultFeatures;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-green-50 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }} 
                  className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                >
                  {data?.hero_title || initialTitle}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }} 
                  className="text-lg text-gray-700 mb-6"
                >
                  {data?.hero_subtitle || "Specialized solutions for the safe and efficient delivery of liquid cargo"}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link 
                    to={data?.cta_button_link || navPaths.contact} 
                    className="px-6 py-3 bg-brand-gold hover:bg-amber-400 text-brand-navy font-medium rounded-md shadow-md transition-all inline-block"
                  >
                    {data?.cta_button_text || "Get in Touch"}
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
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={data?.hero_image_url || "/lovable-uploads/liquid.jpg"} 
                      alt={`${data?.hero_title || initialTitle} Service`} 
                      className="w-full h-full object-cover" 
                    />
                  </AspectRatio>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                {data?.section1_title || `Specialized Expertise in ${data?.hero_title || initialTitle}`}
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
              <p className="text-gray-700 mb-6 text-justify whitespace-pre-wrap leading-relaxed">
                {data?.section1_content || defaultSection1Content}
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="max-w-5xl mx-auto mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {data?.features_title || "Key Features"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {displayFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }} 
                    viewport={{ once: true }} 
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="mb-4 bg-amber-50 p-3 rounded-full inline-block">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
              <h3 className="text-2xl font-bold mb-4 text-slate-50">{data?.cta_title || "Ready to Transport Your Liquid Cargo?"}</h3>
              <p className="mb-6 text-green-50">
                Contact our specialists today for tailored transportation solutions.
              </p>
              <Link 
                to={data?.cta_button_link || navPaths.contact} 
                className="inline-block bg-white text-brand-navy px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
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

export default LiquidTransportation;
