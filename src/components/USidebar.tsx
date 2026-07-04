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

const countries = [{
 code: "in",
  name: "India",
  lat: 9.9323,
  lng: 76.2996,
  cities: [{
    name: "Kochi",
    lat: 9.9323,
    lng: 76.2996,
    address: "CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013 , Kerala.",
    contacts: ["+91 484 4019192 / 93"],
    email: "info.india@ggl.sg"
  },{
    name: "Mumbai",
    lat: 19.01123,
    lng: 73.03715,
    address: "803 / 804, Shelton Cubix, Plot No. 87, Sector-15,CBD Belapur, Navi Mumbai, Maharastra - 400614.",
    contacts: ["022-35131688 / 35113475 / 35082586"],
    email: "info.india@ggl.sg"
  }, {
    name: "Mumbai-Andheri",
    lat: 19.11303, 
    lng: 72.86848,
    address: "503, Midas, Sahar Plaza Complex,Sir M.V Road,Andheri East, Mumbai 400059",
    contacts: ["+91 8879756838"],
    email: "info.india@ggl.sg"
  },{
    name: "Delhi",
    lat: 28.62748,
    lng: 77.2221,
    address: "903, Surya Kiran Building K.G Marg,Connaught Place New Delhi - 110001",
    contacts: ["+91 11 493224477 / 48 /49"],
    email: "info.india@ggl.sg"
  }, {
    name: "Punjab",
    lat: 30.89135,
    lng: 75.93255,
    address: "No. 7A, G K Estate,Hari Nagar, Mundian Kalan,Chandigarh Road,Ludhiana, Punjab – 141015",
    contacts: ["+91 62845 49881"],
    email: "navjot.kohli@ggl.sg"
  },{
    name: "Bangalore",
    lat: 13.01855,
    lng: 77.64191,
    address: "3C-964 IIIrd Cross Street,HRBR LAYOUT 1st Block,Kalayan Nagar Bannaswadi,Bengaluru - 560043.",
    contacts: ["+91 9841676259"],
    email: "info.india@ggl.sg"
  }, {
    name: "Kolkata",
    lat: 22.5769, 
    lng: 88.4341,
    address: "Merlin Matrix, 3rd floor, Room No. 303 10,D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata – 700091",
    contacts: ["+91 33 46025458 / 59 / 60/ 61"],
    email: "info.india@ggl.sg"
  }]
}, {
  code: "my",
  name: "Malaysia",
  lat: 1.4720,
  lng: 103.9027,
  cities: [{
    name: "PASIRGUDANG",
    lat: 1.4720,
    lng: 103.9027,
    address: "Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru",
    contacts: ["+603-3319 2778 / 74 / 75, 79"],
    email: "info@oecl.sg"
  }, {
    name: "PORTKLANG",
    lat: 3.0038,
    lng: 101.3929,
    address: "MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200, Klang, Selangor D.E",
    contacts: ["+603 - 3319 2778 / 74 / 75"],
    email: "info@oecl.sg"
  }]
}, {
  code: "cn",
  name: "China",
    lat: 22.54262,
    lng: 114.11696,
  cities: [{
    name: "China",
    lat: 22.54262,
    lng: 114.11696,
    address: "13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.",
    contacts: ["+86 75582222447"],
    email: "helen@haixun.co"
  }]
},{
  code: "pk",
  name: "Pakistan",
  lat: 24.8608,
  lng: 67.0097,
  cities: [{
    name: "Karachi",
    lat: 24.8608,
    lng: 67.0097,
    address: "Suite No.301, 3rd Floor, Fortune Center, Shahrah-e-Faisal, Block 6, PECHS, Karachi, Pakistan",
    contacts: ["+92-300-8282511", "+92-21-34302281-5"]
  }, {
    name: "Lahore",
    lat: 31.5204,
    lng: 74.3487,
    address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan",
    contacts: ["+92 42-35782306/07/08"]
  }]
}, {
  code: "sg",
  name: "Singapore",
  lat: 1.3521,
  lng: 103.8198,
  cities: [{
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore - 099447",
    contacts: ["+ 65 69084188"],
    email: "june@ggl.sg"
  }]
}, {
  code: "id",
  name: "Indonesia",
    lat: -6.2088,
    lng: 106.8456,
  cities: [{
    name: "Jakarta",
    lat: -6.2088,
    lng: 106.8456,
    address: "408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta",
    contacts: ["+62 21 529 20292, 522 4887"],
    email: "logistics.jkt@oecl.sg"
  }, {
    name: "Surabaya",
    lat: -7.2575,
    lng: 112.7521,
    address: "Japfa Indoland Center, Japfa Tower 1, Lantai 4/401-A JL Jend, Basuki Rahmat 129-137, Surabaya 60271",
    contacts: ["+62 21 529 20292, 522 4887"],
    email: "logistics.jkt@oecl.sg"
  }]
}, {
  code: "lk",
  name: "Sri Lanka",
    lat: 6.9271,
    lng: 79.8612,
  cities: [{
    name: "Colombo",
    lat: 6.9271,
    lng: 79.8612,
    address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka",
    contacts: ["+94 114477499", "+94 114477494 / 98"],
    email: "info.cmb@globalconsol.com"
  }]
}, {
  code: "th",
  name: "Thailand",
    lat: 13.7563,
    lng: 100.5018,
  cities: [{
    name: "Bangkok",
    lat: 13.7563,
    lng: 100.5018,
    address: "109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109",
    contacts: ["+662-634-3240", "+662-634-3942"],
    email: "info@oecl.sg"
  }]
}, {
  code: "mm",
  name: "Myanmar",
    lat: 16.8409,
    lng: 96.1735,
  cities: [{
    name: "Yangon",
    lat: 16.8409,
    lng: 96.1735,
    address: "No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar",
    contacts: ["+951 243158", "+951 377985, 243101"],
    email: "info@globalconsol.com"
  }]
}, {
  code: "bd",
  name: "Bangladesh",
    lat: 23.8103,
    lng: 90.4125,
  cities: [{
    name: "Dhaka",
    lat: 23.8103,
    lng: 90.4125,
    address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
    contacts: ["+880 1716 620989"]
  }]
},{
  code: "ae",
  name: "United Arab Emirates (UAE)",
    lat: 25.2048,
    lng: 55.2708,
  cities: [{
    name: "Dubai",
    lat: 25.2048,
    lng: 55.2708,
    address: "Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E",
    contacts: ["+971 4 3433388"],
    email: "inquiries@futurenetlogistics.com" 
  }, {
    name: "JEBEL ALI",
    lat: 24.9857,
    lng: 55.1436,
    address: "Warehouse# Zg06, Near Roundabout 13, North Zone, p. B No: 30821, jebel Ali, Dubai, U.A.E",
    contacts: ["+971 4 8819787"],
    email: "info@futurenetlogistics.com"
  }, {
    name: "ABU DHABI",
    lat: 24.4539,
    lng: 54.3773,
    address: "PB No: 30500, Office 3-1, Unit 101, 1st Floor, Al Jaber Jewellery Building, Al Khalidiya, Abu Dhabi, U.A.E",
    contacts: ["+971 50 4337214"],
    email: "info@futurenetlogistics.com"
  }]
}, {
  code: "qa",
  name: "Qatar",
    lat: 25.276987,
    lng: 51.520008,
  cities: [{
    name: "Doha",
    lat: 25.276987,
    lng: 51.520008,
    address: "Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha",
    contacts: ["0974 33622555"],
    email: "info@oneglobalqatar.com"
  }]
}, {
  code: "sa",
  name: "Saudi Arabia",
  lat: 26.4207,
    lng: 50.0888,
  cities: [{
    name: "Dammam",
    lat: 26.4207,
    lng: 50.0888,
    address: "Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233",
    contacts: ["+966 13 343 0003"],
    email: "info.sa@futurenetlogistics.com"
  }, {
    name: "Riyadh",
    lat: 24.7136,
    lng: 46.6753,
    address: "Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332",
    contacts: ["+966 11295 0020"],
    email: "info.sa@futurenetlogistics.com"
  }, {
    name: "Jeddah",
    lat: 21.4858,
    lng: 39.1925,
    address: "Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia",
    contacts: ["+966 12 578 0874"],
    email: "info.sa@futurenetlogistics.com"
  }]
}, {
  code: "us",
  name: "United States (USA)",
    lat: 41.8781,
    lng: -87.6298,
  cities: [{
    name: "Chicago",
    lat: 41.8781,
    lng: -87.6298,
    address: "939 W. North Avenue, Suite 750, Chicago, IL 60642",
    contacts: ["+1 847 254 7320"],
    email: "info@gglusa.us"
  }, {
    name: "New York",
    lat: 40.7128,
    lng: -74.0060,
    address: "New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830",
    contacts: ["+1 732 456 6780"],
    email: "info@gglusa.us"
  }, {
    name: "Los Angeles",
    lat: 34.0522,
    lng: -118.2437,
    address: "2250 South Central Avenue Compton, CA 90220",
    contacts: ["+1 310 928 3903"],
    email: "info@gglusa.us"
  }]
}, {
  code: "au",
  name: "Australia",
    lat: -37.8136,
    lng: 144.9631,
  cities: [{
    name: "Melbourne",
    lat: -37.8136,
    lng: 144.9631,
    address: "Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043",
    contacts: ["Mob: +61 432254969", "Tel: +61 388205157"],
    email: "info@gglaustralia.com"
  }]
}];

// Sort countries alphabetically by name
const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

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

  const activeCountriesList = dynamicCountries.length > 0 ? dynamicCountries : sortedCountries;

  useEffect(() => {
    iframeRef.current = document.querySelector('iframe');
  }, []);

  // Set default selected location to the first city of the first country
  useEffect(() => {
    if (!hasInitialized && activeCountriesList.length > 0 && activeCountriesList[0].cities.length > 0) {
      const firstCountry = activeCountriesList[0];
      const firstCity = firstCountry.cities[0];
      setSelectedLocation(firstCity);
      setExpandedCountry(firstCountry.name);
      
      // Initialize selected city indexes for all countries to 0 (first city)
      const initialIndexes: { [countryName: string]: number } = {};
      activeCountriesList.forEach(country => {
        initialIndexes[country.name] = 0;
      });
      setSelectedCityIndexes(initialIndexes);
      
      // Navigate to the first location on map
      navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
      setHasInitialized(true);
    }
  }, [activeCountriesList, hasInitialized]);

  const navigateToLocation = (lat: number, lng: number, city: any = null) => {
    // Find the iframe in the ContactMapContainer
    const iframe = document.querySelector('iframe[title="Interactive Map"]') as HTMLIFrameElement;
    if (iframe) {
      try {
        // Use higher zoom level for city-specific locations
        const zoomLevel = city ? 10 : 10;
        const baseUrl = "https://www.google.com/maps/d/u/0/embed?mid=1d5jZQlEjnKqnsGHvdJWR5wB_-fcQ_Zk&ehbc=2E312F";
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