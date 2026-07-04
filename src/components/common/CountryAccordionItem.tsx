import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Home, Phone, Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityContact {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  contacts?: string[];
  email?: string;
}

interface CountryData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  cities: CityContact[];
}

interface CountryAccordionItemProps {
  country: CountryData;
  isExpanded: boolean;
  onToggle: (countryName: string) => void;
  selectedCityIndex: number;
  onSelectCity: (country: CountryData, cityIndex: number) => void;
  isMobile: boolean;
  setSelectedLocation: (location: any) => void;
  navigateToLocation: (lat: number, lng: number, city?: any) => void;
}

const CountryAccordionItem: React.FC<CountryAccordionItemProps> = React.memo(({
  country,
  isExpanded,
  onToggle,
  selectedCityIndex,
  onSelectCity,
  isMobile,
  setSelectedLocation,
  navigateToLocation
}) => {
  return (
    <AccordionItem 
      value={country.name} 
      className="border border-red-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
    >
      <AccordionTrigger 
        onClick={() => {
          onToggle(country.name);
          navigateToLocation(country.lat, country.lng);
        }}
        className="rounded-t-md hover:bg-amber-50 transition-colors px-3 py-2"
      >
        <div className="flex items-center gap-3">
          <img 
            src={`/${country.code}.svg`} 
            alt={`${country.name} flag`} 
            className="w-6 h-6 rounded-sm object-cover shadow-sm" 
            loading="lazy"
          />
          <span className="font-medium">{country.name}</span>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="bg-gradient-to-b from-red-50/30 to-white px-3 py-2">
        <div className="space-y-2">
          <div className="space-y-2">
            {country.cities.map((city, index) => {
              const isSelected = selectedCityIndex === index;
              return (
                <div key={index} className="w-full">
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "w-full justify-start text-sm p-2 h-auto rounded-md border transition-all shadow-sm",
                      isSelected 
                        ? "bg-red-100 hover:bg-red-150 border-red-300 text-red-800" 
                        : "bg-white hover:bg-red-50 border-gray-100 hover:border-red-200"
                    )}
                    onClick={() => {
                      onSelectCity(country, index);
                      if (isMobile) {
                        setTimeout(() => setSelectedLocation({ ...city }), 50);
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                    <span className="font-medium truncate">{city.name}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-red-300 flex-shrink-0" />
                  </Button>
                  
                  {isSelected && city.address && (
                    <div className="mt-2 p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 shadow text-sm animate-in fade-in duration-300 w-full">
                      <h4 className="font-semibold text-red-700 mb-2 pb-1 border-b border-red-100 flex items-center">
                        <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{city.name} Office</span>
                      </h4>
                      
                      <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                        <Home className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                        <p className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words w-full overflow-hidden text-left">{city.address}</p>
                      </div>
                      
                      {city.contacts && city.contacts.length > 0 && (
                        <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                          <Phone className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                          <div className="space-y-1 w-full overflow-hidden text-left">
                            {city.contacts.map((contact, idx) => (
                              <p key={idx} className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words">{contact}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {city.email && (
                        <div className="flex items-start group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                          <Mail className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                          <a 
                            href={`mailto:${city.email}`} 
                            className="text-red-600 hover:text-red-800 hover:underline flex items-center text-sm break-words w-full overflow-hidden text-left"
                          >
                            {city.email}
                            <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

CountryAccordionItem.displayName = "CountryAccordionItem";

export default CountryAccordionItem;
