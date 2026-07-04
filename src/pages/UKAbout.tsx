import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import SEO from '@/components/SEO';

const ukNavPaths = {
  home: "/uk",
  about: "/uk/about",
  services: "/uk/services",
  careers: "/uk/careers",
  contact: "/uk/contact",
  globalPresence: "/uk/global-presence",
};

const UKAbout = () => {
  const [content, setContent] = useState({
    hero_title: "About GGL UK",
    hero_subtitle: "Dynamic logistics solutions supporting UK import, export, and distribution.",
    about_title: "About Us",
    paragraph_1: "GGL UK provides flexible supply chain options that connect the British markets with international logistics hubs.",
    paragraph_2: "From our UK presence, we coordinate customs coordination, road transport, ocean freight, and premium air freight.",
    paragraph_3: "We partner with leading ocean carriers and airlines to secure space allocations, providing reliable schedules year-round.",
    paragraph_4: "Our proactive team is focused on delivering cost-effective and secure shipping solutions for business clients.",
    image_url: "/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png",
    floating_card_title: "Global Standards",
    floating_card_subtitle: "Highest security & safety"
  });

  useEffect(() => {
    fetch("/api/about-us-page/UK")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        setContent({
          hero_title: data.hero_title || "About GGL UK",
          hero_subtitle: data.hero_subtitle || "",
          about_title: data.about_title || "About Us",
          paragraph_1: data.paragraph_1 || "",
          paragraph_2: data.paragraph_2 || "",
          paragraph_3: data.paragraph_3 || "",
          paragraph_4: data.paragraph_4 || null,
          image_url: data.image_url || "/lovable-uploads/41795fb5-562d-45d1-a8d3-f26724bc079b.png",
          floating_card_title: data.floating_card_title || "",
          floating_card_subtitle: data.floating_card_subtitle || ""
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEO />
      <Header navPaths={ukNavPaths} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 text-white px-6 mt-16 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/Uabout.png"
              alt="UK logistics"
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
      </main>

      <Footer />
    </div>
  );
};

export default UKAbout;