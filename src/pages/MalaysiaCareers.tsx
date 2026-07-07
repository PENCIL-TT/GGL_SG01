import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Heart, Globe, Award, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { useState, useEffect } from 'react';
import { fetchCareersPageSettings, CareersPageSettings } from "@/lib/careers";
import SEO from '@/components/SEO';

const MalaysiaCareers = () => {
  const { navPaths } = useCountryNavigation();

  const [content, setContent] = useState<CareersPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCareersPageSettings("MY")
      .then(data => {
        setContent(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Malaysia careers settings:", err);
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
  const heroTitle = content?.hero_title || "Join Our Malaysia Team";
  const heroSubtitle = content?.hero_subtitle || "Build your career with GGL Malaysia. We're looking for passionate individuals to join our mission of connecting the world through exceptional logistics solutions.";
  const heroButtonText = content?.hero_button_text || "View Open Positions";
  const opportunitiesTitle = content?.opportunities_title || "Current Opportunities";
  const opportunitiesDescription = content?.opportunities_description || "We currently do not have any specific openings listed online for our Malaysia offices. However, we are always looking for talented individuals.";
  const opportunitiesStatus = content?.opportunities_status || "";

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
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-navy mb-4">{content?.why_join_title || "Why Choose GGL?"}</h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {content?.why_join_description || "At GGL, we believe our people are our greatest asset. We foster an environment where talent thrives and careers flourish."}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} viewport={{
              once: true
            }}>
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
                </motion.div>)}
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
              <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                {opportunitiesDescription}
              </p>
              {opportunitiesStatus && (
                <div className="text-center text-gray-500 text-xl font-medium mb-8">{opportunitiesStatus}</div>
              )}
              <a href="mailto:jayesh@ggl.sg"><Button>{content?.cta_btn1_label || "Email Your Resume"}</Button></a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaCareers;