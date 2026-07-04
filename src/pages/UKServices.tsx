import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Plane, Ship, Truck, Warehouse } from "lucide-react";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchServicesPageSettings } from "@/lib/servicesPage";
import { fetchServicesByCountry } from "@/lib/services";
import SEO from '@/components/SEO';

const ServiceCard = ({ icon, title, description, image, link, id }: any) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group grid grid-cols-1 md:grid-cols-2"
    >
      <div className="w-full h-48 md:h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col justify-center">
        <div className="bg-brand-gold text-brand-navy p-2 rounded-full inline-block mb-2 w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-brand-navy mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4 leading-relaxed">{description}</p>
        <Link
          to={link}
          className="text-brand-gold font-medium hover:text-amber-500 inline-flex items-center text-sm"
        >
          Learn More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

const UKServices = () => {
  const { navPaths } = useCountryNavigation();

  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: ["services-page", "UK"],
    queryFn: () => fetchServicesPageSettings("UK"),
  });

  const { data: dbServices, isLoading: isServicesLoading } = useQuery({
    queryKey: ["services-list", "UK"],
    queryFn: () => fetchServicesByCountry("UK"),
  });

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "Plane": return <Plane className="w-5 h-5" />;
      case "Anchor": return <Ship className="w-5 h-5" />;
      case "Truck": return <Truck className="w-5 h-5" />;
      case "Warehouse":
      default: return <Warehouse className="w-5 h-5" />;
    }
  };

  const services = dbServices ? dbServices.map((service, index) => ({
    id: service.id || index,
    htmlId: service.title.toLowerCase().replace(/\s+/g, '-'),
    icon: getIcon(service.icon_type),
    title: service.title,
    image: service.image_url,
    description: service.description,
    link: service.link
  })) : [];

  if (isContentLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
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
  const heroTitle = content?.hero_title || "Our Logistics Services";
  const heroSubtitle = content?.hero_subtitle || "From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.";
  const servicesTitle = content?.services_title || "All Services";
  const servicesDescription = content?.services_description || "Explore our comprehensive range of services designed to meet all your logistics requirements.";
  const ctaBtnText = content?.cta_btn_text || "Request a Quote";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <SEO />
      <Header navPaths={navPaths} />
      <main className="flex-grow pt-16 md:pt-20">
        <section className="bg-gradient-to-r from-gray-900 to-brand-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/lovable-uploads/gp.jpg" alt="Services" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-brand-navy opacity-90" />
          </div>

          <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-slate-50">{heroTitle}</h1>
              <div className="w-16 h-1 bg-brand-gold mx-auto mb-4"></div>
              <p className="text-base md:text-lg text-white/90 mb-4 leading-relaxed">
                {heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">{servicesTitle}</h2>
              <div className="w-20 h-1 bg-brand-gold mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {servicesDescription}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} {...service} id={service.htmlId} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link to={navPaths.contact}>
                <Button variant="gold" size="lg" className="shadow-md">
                  {ctaBtnText}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UKServices;
