import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Plane, Ship, Truck, Warehouse, Package } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";
import { fetchServicesPageSettings, ServicesPageSettings } from "@/lib/servicesPage";
import { fetchServicesByCountry } from "@/lib/services";
import SEO from '@/components/SEO';

// Scroll to Top on Route Change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};

// Service Card Component
const ServiceCard = ({ icon, title, description, image, link }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }} 
      viewport={{ once: true }} 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
    >
      <div className="relative w-full overflow-hidden">
        <AspectRatio ratio={16 / 9} className="w-full">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4">
              <div className="bg-brand-gold text-brand-navy p-2 rounded-full inline-block mb-2">
                {icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            </div>
          </div>
        </AspectRatio>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {description}
        </p>
        <Link to={link} className="text-brand-gold font-medium hover:text-amber-500 inline-flex items-center text-sm">
          Learn More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const { navPaths } = useCountryNavigation();
  const isBangladesh = window.location.pathname.includes('/bangladesh');
  const countryCode = isBangladesh ? 'BD' : 'SG';

  const [content, setContent] = useState<ServicesPageSettings | null>(null);

  useEffect(() => {
    fetchServicesPageSettings(countryCode)
      .then(data => setContent(data))
      .catch(err => console.error("Failed to load services page settings:", err));
  }, [countryCode]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "Plane": return <Plane className="w-5 h-5" />;
      case "Anchor": return <Ship className="w-5 h-5" />;
      case "Truck": return <Truck className="w-5 h-5" />;
      case "Package": return <Package className="w-5 h-5" />;
      case "Warehouse":
      default: return <Warehouse className="w-5 h-5" />;
    }
  };

  const services = [
    { id: 1, title: 'Ocean Freight', description: "GGL's dedicated ocean freight department specialize in the complete range freight management services for LCL and FCL loads, supported thru a well established and reliable partner network around the world, for efficient collection, storage & delivery from shippers door to door.", image: '/lovable-uploads/oceanfrieght.jpg', link: '/services/ocean-freight', icon: getIcon('Anchor') },
    { id: 2, title: 'Air Freight', description: 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis. GGL stands out with competitive rates.', image: '/cargoplane.png', link: '/services/air-freight', icon: getIcon('Plane') },
    { id: 3, title: 'Transportation And Distribution', description: 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence.', image: '/truck12.png', link: '/services/transportation', icon: getIcon('Truck') },
    { id: 4, title: 'Warehousing', description: 'GGL is a premier supply chain solutions provider in Singapore, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and distributors.', image: '/lovable-uploads/warehouse.jpg', link: '/services/warehousing', icon: getIcon('Warehouse') },
    { id: 5, title: 'LCL Consolidation', description: 'GGL is a LCL Consolidator with global presence covering North America, UK, Middle East, Indian Sub Continent, South East Asia and Far East. Our LCL Groupage services is backed by very efficient customer support at competitive prices.', image: '/lcl.png', link: '/services/lcl-consolidation', icon: getIcon('Warehouse') },
    { id: 6, title: 'Project Cargo', description: 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure or construction projects.', image: '/projectcargo3.png', link: '/services/project-cargo', icon: getIcon('Package') }
  ];



  // Fallbacks
  const heroTitle = content?.hero_title || (isBangladesh ? "Our Logistics Services in Bangladesh" : "Our Logistics Services");
  const heroSubtitle = content?.hero_subtitle || "From air and ocean freight to specialized transportation solutions, we offer end-to-end logistics expertise to meet your global shipping needs.";
  const servicesTitle = content?.services_title || "All Services";
  const servicesDescription = content?.services_description || "Explore our comprehensive range of services designed to meet all your logistics requirements.";
  const whyChooseTitle = content?.why_choose_title || "Why Choose Our Logistics Services?";
  const whyChooseDescription = content?.why_choose_description || "We combine industry expertise, advanced technology, and personalized care to deliver exceptional logistics solutions.";
  const ctaBtnText = content?.cta_btn_text || "Request a Quote";

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <SEO />
      <Header />

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-brand-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/lovable-uploads/gp.jpg" alt="Services" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-brand-navy opacity-90"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                {heroTitle}
              </h1>
              <div className="w-20 h-1 bg-brand-gold mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                {heroSubtitle}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              viewport={{ once: true }} 
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                {servicesTitle}
              </h2>
              <div className="w-20 h-1 bg-brand-gold mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {servicesDescription}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => <ServiceCard key={service.id} {...service} />)}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              viewport={{ once: true }} 
              className="text-center max-w-2xl mx-auto mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3">
                {whyChooseTitle}
              </h2>
              <div className="w-20 h-1 bg-brand-gold mx-auto mb-3"></div>
              <p className="text-gray-700 leading-relaxed">
                {whyChooseDescription}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
                title: "🌍 Global Network",
                description: "Leverage our extensive worldwide connections for efficient shipping."
              }, {
                title: "🎯 Customized Solutions",
                description: "Tailored logistics plans designed for your business."
              }, {
                title: "📡 Advanced Technology",
                description: "Real-time tracking & cutting-edge logistics systems."
              }, {
                title: "👨‍✈️ Expert Team",
                description: "Industry professionals with years of logistics experience."
              }, {
                title: "✅ Regulatory Compliance",
                description: "Ensure smooth operations with up-to-date knowledge."
              }, {
                title: "📞 24/7 Support",
                description: "Get help anytime with round-the-clock customer service."
              }].map((feature, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5, delay: index * 0.1 }} 
                  viewport={{ once: true }} 
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow border-l-4 border-brand-gold"
                >
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
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

export default Services;
