import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import MapContainer from '@/components/MapContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Map, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const MSidebar = lazy(() => import('@/components/MSidebar'));

const malaysiaNavPaths = {
  home: "/malaysia",
  about: "/malaysia/about",
  services: "/malaysia/services",
  careers: "/malaysia/careers",
  contact: "/malaysia/contact",
  globalPresence: "/malaysia/global-presence",
};

const MalaysiaGlobalPresence = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [mapUrl, setMapUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/api/global-presence/MY')
      .then(res => res.json())
      .then(data => {
        if (data && data.map_iframe_url) {
          setMapUrl(data.map_iframe_url);
        }
      })
      .catch(err => console.error("Error fetching map url:", err));
  }, []);

  useEffect(() => {
    if (isMobile) {
      setShowMap(false);
      setIsSidebarOpen(true);
    } else {
      setShowMap(true);
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/30 to-white">
      <SEO />
      <Header navPaths={malaysiaNavPaths} />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }} 
        className="flex flex-1 relative overflow-hidden mx-0 my-[80px]"
      >
        {isMobile && (
          <div className="fixed top-20 left-0 right-0 z-30 bg-gradient-to-r from-amber-500 to-amber-400 p-3 text-white text-center shadow-md">
            <h1 className="text-lg font-bold">Global Presence</h1>
          </div>
        )}
        
        {(!isMobile || (isMobile && showMap)) && (
          <motion.main 
            initial={isMobile ? { x: '100%' } : { opacity: 0 }} 
            animate={isMobile ? { x: 0 } : { opacity: 1 }} 
            exit={isMobile ? { x: '100%' } : { opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
            className={`transition-all duration-300 ease-in-out ${isMobile ? 'w-full' : 'w-[60%]'}`}
          >
            <MapContainer mapUrl={mapUrl} />
          </motion.main>
        )}
        
        {(!isMobile || (isMobile && !showMap)) && (
          <motion.div 
            initial={isMobile ? { x: '-100%' } : { opacity: 0 }} 
            animate={isMobile ? { x: 0 } : { opacity: 1 }} 
            exit={isMobile ? { x: '-100%' } : { opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
            className={`transition-all duration-300 ease-in-out ${isMobile ? 'w-full pt-12' : 'w-[35%]'}`}
          >
            <Suspense fallback={<div className="p-4">Loading locations...</div>}>
              <MSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </Suspense>
          </motion.div>
        )}

        {isMobile && (
          <div className="fixed bottom-4 right-4 z-50 flex gap-2">
            <Button
              onClick={toggleView}
              className="rounded-full shadow-lg bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy transition-colors"
              size="icon"
            >
              {showMap ? <Menu size={24} /> : <Map size={24} />}
            </Button>
          </div>
        )}
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default MalaysiaGlobalPresence;