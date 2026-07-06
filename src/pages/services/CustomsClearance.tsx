import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { FileCheck, ShieldCheck, Lightbulb, Globe, CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import SEO from '@/components/SEO';

const CustomsClearance = () => {
  const { navPaths, isBangladesh, isPakistan, isUK, isMalaysia } = useCountryNavigation();
  const countryCode = isBangladesh ? "BD" : isPakistan ? "PK" : isUK ? "UK" : isMalaysia ? "MY" : "SG";

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(`/api/service-details/${countryCode}/customs-clearance`)
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
      title: "Documentation Expertise",
      description: "Our team ensures all your customs documentation is accurate, complete, and submitted correctly, preventing delays and ensuring compliance with international regulations.",
      icon: <FileCheck className="h-16 w-16 text-white" />
    },
    {
      title: "Regulatory Compliance",
      description: "Stay compliant with constantly evolving international trade regulations. We keep up-to-date with changes to ensure your shipments meet all legal requirements.",
      icon: <ShieldCheck className="h-16 w-16 text-white" />
    },
    {
      title: "Expert Consultation",
      description: "Our customs experts provide guidance on duty and tax implications, helping you make informed decisions and optimize your international shipping strategy.",
      icon: <Lightbulb className="h-16 w-16 text-white" />
    }
  ];

  const defaultSection1Content = `Navigating the complexities of global trade is simplified with our expert customs clearance services. We ensure your shipments move smoothly across borders, handling all aspects of the process from accurate documentation and tariff classification to regulatory compliance and specialized cargo handling.

Our experienced team stays abreast of evolving regulations, leverages advanced technology for expedited clearance, and maintains strong relationships with customs authorities worldwide. We prioritize transparency and open communication, providing real-time updates and peace of mind, allowing you to focus on your core business. Trust us to manage your import and export needs, minimizing delays and ensuring your shipments reach their destinations efficiently and compliantly.`;

  // Determine features to display and map gradients
  const displayFeatures = data?.features_list && data.features_list.length > 0
    ? data.features_list.map((featTitle: string, index: number) => {
        const found = defaultFeatures.find(f => f.title.toLowerCase().includes(featTitle.toLowerCase()) || featTitle.toLowerCase().includes(f.title.toLowerCase()));
        return {
          title: featTitle,
          description: found?.description || "Expert customs brokerage, regulatory compliance, and clearance services.",
          icon: found?.icon || <FileCheck className="h-16 w-16 text-white" />,
          gradient: index % 3 === 0 
            ? "from-blue-500 to-blue-600" 
            : index % 3 === 1 
            ? "from-green-500 to-green-600" 
            : "from-amber-500 to-amber-600"
        };
      })
    : defaultFeatures.map((f, index) => ({
        ...f,
        gradient: index === 0 
          ? "from-blue-500 to-blue-600" 
          : index === 1 
          ? "from-green-500 to-green-600" 
          : "from-amber-500 to-amber-600"
      }));

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
                  {data?.hero_title || "Customs Clearance Services"}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: 0.1 }} 
                  className="text-lg text-gray-700 mb-6"
                >
                  {data?.hero_subtitle || "Expert solutions for seamless border crossings"}
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
                  <img 
                    src={data?.hero_image_url || "/lovable-uploads/cc.jpg"} 
                    alt="Customs Clearance Service" 
                    className="w-full h-auto object-cover" 
                  />
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
                {data?.section1_title || "Seamless Customs Clearance Solutions"}
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
              <p className="text-gray-700 mb-6 text-justify whitespace-pre-wrap leading-relaxed">
                {data?.section1_content || defaultSection1Content}
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayFeatures.map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: index * 0.1 }} 
                  viewport={{ once: true }} 
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100"
                >
                  <div className={`h-48 bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 text-justify text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Additional Services - Always visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }} 
                viewport={{ once: true }} 
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-gold" />
                  Import Clearance
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Our import clearance services streamline the process of bringing goods into the country, ensuring compliance with local regulations and minimizing delays.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>Duty and tax calculation</li>
                  <li>Entry preparation and filing</li>
                  <li>Tariff classification</li>
                  <li>Customs examination support</li>
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }} 
                viewport={{ once: true }} 
                className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-brand-gold" />
                  Export Clearance
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Our export clearance services ensure your goods leave the country efficiently, with all necessary documentation and compliance requirements met.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
                  <li>Export documentation preparation</li>
                  <li>License and permit management</li>
                  <li>Security filing and compliance</li>
                  <li>Electronic export information filing</li>
                </ul>
              </motion.div>
            </div>
            
            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              viewport={{ once: true }} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8 text-center"
            >
              <h3 className="text-2xl font-bold mb-4 text-slate-50">{data?.cta_title || "Need Customs Clearance Services?"}</h3>
              <p className="mb-6 text-blue-50">
                Contact our customs experts today for seamless border crossings.
              </p>
              <Link 
                to={data?.cta_button_link || navPaths.contact} 
                className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
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

export default CustomsClearance;
