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

const PakistanServices = () => {
  const { navPaths } = useCountryNavigation();

  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: ["services-page", "PK"],
    queryFn: () => fetchServicesPageSettings("PK"),
    retry: false
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

  const defaultServices = [
    { id: 1, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image: '/ps1.png', link: '/pakistan/services/ocean-freight', icon: getIcon('Anchor') },
    { id: 2, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image: '/ps5.png', link: '/pakistan/services/lcl-consolidation', icon: getIcon('Warehouse') },
    { id: 3, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image: '/ps3.png', link: '/pakistan/services/transportation', icon: getIcon('Truck') },
    { id: 4, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image: '/ps4.png', link: '/pakistan/services/warehousing', icon: getIcon('Warehouse') },
    { id: 5, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image: '/ps2.png', link: '/pakistan/services/air-freight', icon: getIcon('Plane') },
    { id: 6, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image: '/ps6.png', link: '/pakistan/services/project-cargo', icon: getIcon('Warehouse') }
  ];

  const services = defaultServices.map((s, i) => ({
    ...s,
    htmlId: s.title.toLowerCase().replace(/\s+/g, '-')
  }));



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

export default PakistanServices;
