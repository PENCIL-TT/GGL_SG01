import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCountryNavigation } from "@/hooks/useCountryNavigation";

interface FooterOffice {
  id?: number;
  country_code: string;
  office_index: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
}

interface FooterGeneral {
  about_text: string;
  facebook_url?: string;
  linkedin_url?: string;
}

export const Footer = () => {
  const { isBangladesh, isPakistan, isUK, isMalaysia, navPaths } =
    useCountryNavigation();

  const footerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const navigationLinks = [
    { name: "Home", path: navPaths.home },
    { name: "About", path: navPaths.about },
    { name: "Services", path: navPaths.services },
    { name: "Careers", path: navPaths.careers },
    { name: "Global Presence", path: navPaths.globalPresence },
    { name: "Contact Us", path: navPaths.contact },
  ];

  const singaporeContact = {
    title: "GGL (Singapore) Pte Ltd.",
    address: `Blk 511 Kampong Bahru Road
#03-01 Keppel Distripark
Singapore - 099447`,
    phone: "+65 69080838",
    email: "june@ggl.sg",
  };

  const bangladeshContact = {
    title: "GGL (Bangladesh) Ltd.",
    address:
      "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
    email: "info.bd@ggl.sg",
  };

  const karachiContact = {
    title: "GGL (Pakistan) - Karachi",
    address:
      "Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.",
    phone:
      "+92 21 34542881 / +92 21 34542882 / +92 21 34542883 / +92 21 34542884",
    email: "info.pk@ggl.sg",
  };

  const ukContact = {
    title: "GGL (UK) Ltd.",
    address:
      "15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.",
    phone: "+44(0)7305 856 612",
    email: "Sukant@ggl.sg",
  };

  const portKlangContact = {
    title: "GGL (Malaysia) - Port Klang",
    address:
      "MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E",
    phone: "+603 - 3319 2778 / 74 / 75",
    email: "jayesh@ggl.sg",
  };

  const pasirGudangContact = {
    title: "GGL (Malaysia) - Pasir Gudang",
    address:
      "Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru",
    phone: "603-3319 2778 / 74 / 75, 79",
    email: "jayesh@ggl.sg",
  };

  const [offices, setOffices] = useState<FooterOffice[]>([]);
  const [general, setGeneral] = useState<FooterGeneral>({
    about_text: "At GGL, we are proud to be one of Singapore's leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.",
    facebook_url: "https://www.facebook.com/gglusa",
    linkedin_url: "https://www.linkedin.com/company/gglus/"
  });

  useEffect(() => {
    // Fetch general footer settings
    fetch("/api/footer/general")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load footer general settings");
      })
      .then(data => {
        if (data) {
          setGeneral(data);
        }
      })
      .catch(err => console.error(err));

    // Fetch footer offices
    fetch("/api/footer/offices")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load footer offices");
      })
      .then(data => {
        if (data && Array.isArray(data)) {
          setOffices(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const currentCountryCode = isBangladesh ? 'BD' : isPakistan ? 'PK' : isUK ? 'UK' : isMalaysia ? 'MY' : 'SG';

  const activeOffices = useMemo(() => {
    const countryOffices = offices.filter(o => o.country_code === currentCountryCode);
    if (countryOffices.length > 0) {
      return countryOffices;
    }
    // Fallbacks if backend call hasn't finished or is offline
    if (currentCountryCode === 'BD') {
      return [{ title: bangladeshContact.title, address: bangladeshContact.address, email: bangladeshContact.email }];
    } else if (currentCountryCode === 'PK') {
      return [karachiContact];
    } else if (currentCountryCode === 'UK') {
      return [ukContact];
    } else if (currentCountryCode === 'MY') {
      return [portKlangContact, pasirGudangContact];
    } else {
      return [singaporeContact];
    }
  }, [offices, currentCountryCode]);

  return (
    <footer className="pt-16 pb-8 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="h-1 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-navy rounded-full mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-4">
          {/* Column 1 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerAnimation}
            className="flex flex-col items-start"
          >
            <div className="mb-4 text-left">
              <img
                src="/lovable-uploads/GGL.png"
                alt="GGL Logo"
                className="h-14 w-auto object-contain"
                loading="lazy"
              />
              <img
                src="/1GlobalEnterprises.png"
                alt="1 Global Enterprises Logo"
                className="h-10 w-auto object-contain mt-2"
              />
            </div>

            <p className="text-sm md:text-base text-gray-600 max-w-xs text-left leading-relaxed">
              {general.about_text}
            </p>

            <div className="flex space-x-3 mt-4">
              {general.facebook_url && (
                <motion.a
                  href={general.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-navy text-white p-2 rounded-full hover:bg-brand-gold transition"
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  <Facebook size={18} />
                </motion.a>
              )}

              {general.linkedin_url && (
                <motion.a
                  href={general.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-navy text-white p-2 rounded-full hover:bg-brand-gold transition"
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  <Linkedin size={18} />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerAnimation}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-start md:items-end lg:items-start lg:pl-10"
          >
            <h3 className="font-bold text-lg text-brand-navy mb-4">
              Navigation
            </h3>

            <div className="flex flex-col gap-2">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-600 hover:text-brand-gold transition flex items-center gap-2"
                >
                  <ArrowRight size={14} className="text-brand-gold" />
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={footerAnimation}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-start md:items-end lg:items-start lg:pl-10"
          >
            <h3 className="font-bold text-lg text-brand-navy mb-4">
              Contact Us
            </h3>

            <div className="space-y-6 w-full">
              {activeOffices.map((office, idx) => (
                <div key={idx} className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-brand-gold mt-1 flex-shrink-0" />
                    <p className="whitespace-pre-line text-left">
                      <strong>{office.title}</strong>
                      {"\n"}
                      {office.address}
                    </p>
                  </div>

                  {office.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-brand-gold flex-shrink-0" />
                      <p>{office.phone}</p>
                    </div>
                  )}

                  {office.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-brand-gold flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="hover:text-brand-gold transition break-all">
                        {office.email}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-center text-gray-600 mt-10 text-sm">
          &copy; {new Date().getFullYear()} GGL. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
