import React from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from 'framer-motion';
import { Users, TrendingUp, Heart, Globe, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { useState, useEffect } from 'react';
import { fetchCareersPageSettings, CareersPageSettings } from "@/lib/careers";
import SEO from '@/components/SEO';

const PakistanCareers = () => {
  const { navPaths } = useCountryNavigation();

  const [content, setContent] = useState<CareersPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCareersPageSettings("PK")
      .then(data => {
        setContent(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Pakistan careers settings:", err);
        setIsLoading(false);
      });
  }, []);

  const benefits = [{
    icon: <Users className="h-6 w-6 text-brand-gold" />,
    title: "Collaborative Culture",
    description: "Work with passionate professionals in a supportive environment that values teamwork and innovation."
  }, {
    icon: <TrendingUp className="h-6 w-6 text-brand-gold" />,
    title: "Career Growth",
    description: "Advance your career with continuous learning opportunities and clear progression paths."
  }, {
    icon: <Heart className="h-6 w-6 text-brand-gold" />,
    title: "Work-Life Balance",
    description: "Enjoy flexible working arrangements and comprehensive benefits that support your well-being."
  }, {
    icon: <Globe className="h-6 w-6 text-brand-gold" />,
    title: "Global Opportunities",
    description: "Be part of an international network with opportunities to work across different markets."
  }, {
    icon: <Award className="h-6 w-6 text-brand-gold" />,
    title: "Recognition",
    description: "Your contributions are valued and recognized through various reward and recognition programs."
  }, {
    icon: <Target className="h-6 w-6 text-brand-gold" />,
    title: "Meaningful Impact",
    description: "Make a real difference in global trade and logistics, connecting businesses worldwide."
  }];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO />
        <Header navPaths={navPaths} />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fallbacks
  const heroTitle = content?.hero_title || "Join Our Pakistan Team";
  const heroSubtitle = content?.hero_subtitle || "Build your career with GGL Pakistan. We're looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.";
  const heroButtonText = content?.hero_button_text || "View Open Positions";
  const whyJoinTitle = content?.why_join_title || "Why Choose GGL Pakistan?";
  const whyJoinDescription = content?.why_join_description || "At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish.";
  const opportunitiesTitle = content?.opportunities_title || "Current Opportunities";
  const opportunitiesDescription = content?.opportunities_description || "Explore exciting career opportunities across our Karachi and Lahore offices.";
  const opportunitiesStatus = content?.opportunities_status || "Career opportunities coming soon. Stay tuned!";
  const ctaTitle = content?.cta_title || "Ready to Start Your Journey?";
  const ctaSubtitle = content?.cta_subtitle || "Don't see the right position? Send us your resume and we'll keep you in mind for future opportunities.";
  const ctaBtn1Label = content?.cta_btn1_label || "Submit Your Resume";
  const ctaBtn2Label = content?.cta_btn2_label || "Contact HR";

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header navPaths={navPaths} />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }} 
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-50">
                {heroTitle}
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                {heroSubtitle}
              </p>
              <Button variant="gold" size="lg" className="font-semibold">
                {heroButtonText}
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }} 
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-brand-navy mb-4">{whyJoinTitle}</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {whyJoinDescription}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: index * 0.1 }} 
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-brand-gold">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        {benefit.icon}
                        <CardTitle className="text-lg">{benefit.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }} 
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-brand-navy mb-4">{opportunitiesTitle}</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {opportunitiesDescription}
              </p>
            </motion.div>

            <div className="text-center text-gray-500 text-xl font-medium">{opportunitiesStatus}</div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }} 
              viewport={{ once: true }} 
              className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-slate-50">{ctaTitle}</h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                {ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gold" size="lg" className="font-semibold">
                  {ctaBtn1Label}
                </Button>
                <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-brand-navy">
                  {ctaBtn2Label}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PakistanCareers;
