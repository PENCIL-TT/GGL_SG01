import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Globe, Ship, Truck, Package, Shield, Target, Users, CheckCircle } from 'lucide-react';
import ScrollToTop from "@/components/common/ScrollToTop";
import SEO from '@/components/SEO';

const malaysiaNavPaths = {
  home: "/malaysia",
  about: "/malaysia/about",
  services: "/malaysia/services",
  careers: "/malaysia/careers",
  contact: "/malaysia/contact",
  globalPresence: "/malaysia/global-presence",
};

const MalaysiaAbout = () => {
  const [content, setContent] = useState({
    hero_title: "GGL Malaysia: Logistics Excellence in Port Klang & Pasir Gudang",
    hero_subtitle: "Local expertise powered by our global network to keep Malaysia supply chains moving by sea, air, and road.",
    about_title: "About Us",
    paragraph_1: "GGL Malaysia provides specialized supply chain solutions out of Port Klang and Pasir Gudang to keep cargo moving seamlessly.",
    paragraph_2: "Our local offices coordinate ocean imports/exports, bonded warehousing, customs brokerage, and local distribution.",
    paragraph_3: "We deliver neutral LCL consolidation services tailored to regional freight forwarders and international traders.",
    paragraph_4: "Supported by advanced digital tools, GGL Malaysia ensures full transparency, efficiency, and reliability.",
    image_url: "/oceanf.png",
    floating_card_title: "Strategic Locations",
    floating_card_subtitle: "Klang & Johor hubs"
  });

  useEffect(() => {
    fetch("/api/about-us-page/MY")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        setContent({
          hero_title: data.hero_title || "GGL Malaysia: Logistics Excellence in Port Klang & Pasir Gudang",
          hero_subtitle: data.hero_subtitle || "",
          about_title: data.about_title || "About Us",
          paragraph_1: data.paragraph_1 || "",
          paragraph_2: data.paragraph_2 || "",
          paragraph_3: data.paragraph_3 || "",
          paragraph_4: data.paragraph_4 || null,
          image_url: data.image_url || "/oceanf.png",
          floating_card_title: data.floating_card_title || "",
          floating_card_subtitle: data.floating_card_subtitle || ""
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <SEO />
      <Header navPaths={malaysiaNavPaths} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 text-white px-6 mt-16 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/Pabout.png"
              alt="Malaysia logistics"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/70" />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-slate-50 drop-shadow">
                {content.hero_title}
              </h1>
              {content.hero_subtitle && (
                <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-slate-50 drop-shadow">
                  {content.hero_subtitle}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  <span className="text-brand-navy">{content.about_title}</span>
                </h2>
                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>{content.paragraph_1}</p>
                  <p>{content.paragraph_2}</p>
                  <p>{content.paragraph_3}</p>
                  {content.paragraph_4 && <p>{content.paragraph_4}</p>}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    alt="GGL Global Logistics"
                    className="w-full h-[600px] object-cover"
                    src={content.image_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Floating Card */}
                {content.floating_card_title && (
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{content.floating_card_title}</h4>
                        {content.floating_card_subtitle && (
                          <p className="text-sm text-gray-600">{content.floating_card_subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose GGL Cards Section */}
        <section className="py-20 bg-white px-6">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Logistics Services */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comprehensive Logistics Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Air & Ocean Freight (LCL & FCL)",
                    description: "Complete import and export solutions for all cargo types.",
                    icon: Ship,
                  },
                  {
                    title: "Dangerous Goods Handling",
                    description: "Specialized expertise in hazardous materials transportation.",
                    icon: Shield,
                  },
                  {
                    title: "Warehousing, Distribution & 3PL",
                    description: "Secure storage and comprehensive third-party logistics solutions.",
                    icon: Package,
                  },
                  {
                    title: "Domestic & Cross-Border Land Transport",
                    description: "Efficient ground transportation across regions.",
                    icon: Truck,
                  },
                ].map(({ title, description, icon: Icon }, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
                        <p className="text-gray-600 text-sm">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who We Serve */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who We Serve (Neutral Consolidation)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Freight Forwarders",
                    description: "Trusted partners for global shipping solutions.",
                    icon: Globe,
                  },
                  {
                    title: "Custom Brokers",
                    description: "Reliable consolidation services for customs clearance.",
                    icon: CheckCircle,
                  },
                  {
                    title: "NVOCCs",
                    description: "Neutral support for non-vessel operating common carriers.",
                    icon: Users,
                  },
                  {
                    title: "3PL Providers",
                    description: "Comprehensive logistics partnership for third-party providers.",
                    icon: Target,
                  },
                ].map(({ title, description, icon: Icon }, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300 border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Icon className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
                        <p className="text-gray-600 text-sm">{description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaAbout;