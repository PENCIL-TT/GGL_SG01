import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, MapPin, Globe, ExternalLink, Phone, Mail, Home, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import CountryAccordionItem from './common/CountryAccordionItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const fallbackCountries = [
  { code: "my", name: "Malaysia", lat: 3.1390, lng: 101.6869, cities: [{ name: "Port Klang", lat: 3.0038, lng: 101.3929, address: "MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E", contacts: ["+603 - 3319 2778 / 74 / 75"], email: "jayesh@ggl.sg" }] },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedCityIndexes, setSelectedCityIndexes] = useState<{ [countryName: string]: number }>({});
  const isMobile = useIsMobile();
  const [dynamicCountries, setDynamicCountries] = useState<any[]>([]);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    fetch('/api/global-presence-offices')
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.text().catch(() => 'Failed to read error response');
          throw new Error(`Server Error (${res.status}): ${errorData || res.statusText}`);
        }
        return res.json();
      })
      .then((offices: any[]) => {
        if (!offices) {
          throw new Error("No offices data returned");
        }
        if (offices.length === 0) return;
        const grouped = offices.reduce((acc: any[], office) => {
          let country = acc.find(c => c.name.toLowerCase() === office.office_country.toLowerCase());
          if (!country) {
            country = {
              code: office.country_code,
              name: office.office_country,
              lat: Number(office.latitude),
              lng: Number(office.longitude),
              cities: []
            };
            acc.push(country);
          }
          country.cities.push({
            name: office.city_name,
            lat: Number(office.latitude),
            lng: Number(office.longitude),
            address: office.address,
            contacts: office.phone ? office.phone.split('/').map((p: string) => p.trim()) : [],
            email: office.email || ""
          });
          return acc;
        }, []);
        setDynamicCountries(grouped.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      })
      .catch(err => {
        console.warn("Using fallback static countries list:", err);
      });
  }, []);

  const activeCountriesList = dynamicCountries.length > 0 ? dynamicCountries : fallbackCountries;

  useEffect(() => {
    iframeRef.current = document.querySelector('iframe');
  }, []);

  // Set default selected location to the first city of Malaysia
  useEffect(() => {
    if (!hasInitialized) {
      const malaysia = activeCountriesList.find(c => c.name === "Malaysia");
      if (malaysia && malaysia.cities.length > 0) {
        const firstCity = malaysia.cities[0];
        setSelectedLocation(firstCity);
        setExpandedCountry(malaysia.name);
        
        // Initialize selected city indexes for all countries to 0 (first city)
        const initialIndexes: { [countryName: string]: number } = {};
        activeCountriesList.forEach(country => {
          initialIndexes[country.name] = 0;
        });
        setSelectedCityIndexes(initialIndexes);
        
        // Navigate to the first location on map
        navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
        setHasInitialized(true);
      } else if (activeCountriesList.length > 0 && activeCountriesList[0].cities.length > 0) {
        // Fallback to first country if Malaysia not found
        const firstCountry = activeCountriesList[0];
        const firstCity = firstCountry.cities[0];
        setSelectedLocation(firstCity);
        setExpandedCountry(firstCountry.name);
        
        const initialIndexes: { [countryName: string]: number } = {};
        activeCountriesList.forEach(country => {
          initialIndexes[country.name] = 0;
        });
        setSelectedCityIndexes(initialIndexes);
        navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
        setHasInitialized(true);
      }
    }
  }, [activeCountriesList, hasInitialized]);

  const navigateToLocation = (lat: number, lng: number, city: any = null) => {
    // Find the iframe in the ContactMapContainer
    const iframe = document.querySelector('iframe[title="Interactive Map"]') as HTMLIFrameElement;
    if (iframe) {
      try {
        // Use higher zoom level for city-specific locations
        const zoomLevel = city ? 12 : 10;
        const baseUrl = "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1";
        const newSrc = `${baseUrl}&z=${zoomLevel}&ll=${lat},${lng}&hl=en&ehbc=2E312F&output=embed`;
        iframe.src = newSrc;
        if (city) {
          setSelectedLocation(city);
        }
      } catch (e) {
        console.error("Navigation failed:", e);
      }
    }
  };

  const handleCitySelection = (country: any, cityIndex: number) => {
    setSelectedCityIndexes(prev => ({
      ...prev,
      [country.name]: cityIndex
    }));
    
    const selectedCity = country.cities[cityIndex];
    navigateToLocation(selectedCity.lat, selectedCity.lng, selectedCity);
  };

  const isSelectedCity = (countryName: string, cityIndex: number) => {
    return selectedCityIndexes[countryName] === cityIndex;
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar container */}
      <div className={`my-3 w-full ${isMobile ? 'max-w-[95%]' : 'max-w-[520px]'} mx-auto px-2 md:px-0`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-t-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-bold text-lg">Global Locations</h2>
          </div>
        </div>

        {/* Content area */}
        <ScrollArea className={`h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-b-xl shadow-md`}>
          <div className="p-4">
            <div className="mt-4 space-y-3">
              <Accordion type="single" collapsible value={expandedCountry || ""} className="w-full space-y-3">
                {activeCountriesList.map(country => (
                  <CountryAccordionItem
                    key={country.name}
                    country={country}
                    isExpanded={expandedCountry === country.name}
                    onToggle={(countryName) => setExpandedCountry(expandedCountry === countryName ? null : countryName)}
                    selectedCityIndex={selectedCityIndexes[country.name] !== undefined ? selectedCityIndexes[country.name] : -1}
                    onSelectCity={handleCitySelection}
                    isMobile={isMobile}
                    setSelectedLocation={setSelectedLocation}
                    navigateToLocation={navigateToLocation}
                  />
                ))}
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;