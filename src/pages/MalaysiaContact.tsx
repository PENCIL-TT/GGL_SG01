import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import PQuickEnquiry from "@/components/home/PQuickEnquiry";
import SEO from '@/components/SEO';

const malaysiaNavPaths = {
  home: "/malaysia",
  about: "/malaysia/about",
  services: "/malaysia/services",
  careers: "/malaysia/careers",
  contact: "/malaysia/contact",
  globalPresence: "/malaysia/global-presence",
};

const MalaysiaContact = () => {
  const [content, setContent] = useState({
    title: "Contact Us - Malaysia",
    subtitle: "",
    email_recipient: "jayesh@ggl.sg",
    phone: "+603 - 3319 2778 / 74 / 75",
    address: "Port Klang Office: MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E",
    map_iframe_url: "https://www.google.com/maps?q=The+Landmark+Bandar+Bukit+Tinggi+2+Klang&output=embed"
  });

  useEffect(() => {
    fetch('/api/contact-page-content/MY')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Offline");
      })
      .then(data => {
        setContent({
          title: data.title || "Contact Us - Malaysia",
          subtitle: data.subtitle || "",
          email_recipient: data.email_recipient || "jayesh@ggl.sg",
          phone: data.phone || "+603 - 3319 2778 / 74 / 75",
          address: data.address || "Port Klang Office: MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E",
          map_iframe_url: data.map_iframe_url || "https://www.google.com/maps?q=The+Landmark+Bandar+Bukit+Tinggi+2+Klang&output=embed"
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header navPaths={malaysiaNavPaths} />

      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-12 text-brand-navy">
          {content.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Port Klang Office */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-brand-gold border-b pb-2">
              Port Klang Office
            </h2>

            {/* Address Box */}
            <div className="border rounded-lg p-4 mb-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-brand-navy" />
                <p>
                  {content.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-navy" />
                <span className="font-medium">
                  {content.phone}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-navy" />
                <a href={`mailto:${content.email_recipient}`} className="font-medium hover:text-brand-gold">
                  {content.email_recipient}
                </a>
              </div>
            </div>

            {/* Clean Google Map */}
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Port Klang Office Map"
                src={content.map_iframe_url}
                className="w-full h-64 border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Pasir Gudang Office */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-brand-gold border-b pb-2">
              Pasir Gudang Office
            </h2>

            {/* Address Box */}
            <div className="border rounded-lg p-4 mb-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-brand-navy" />
                <p>
                  Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-navy" />
                <span className="font-medium">
                  603-3319 2778 / 74 / 75, 79
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-navy" />
                <a href="mailto:jayesh@ggl.sg" className="font-medium hover:text-brand-gold">
                  jayesh@ggl.sg
                </a>
              </div>
            </div>

            {/* Clean Google Map */}
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Pasir Gudang Office Map"
                src="https://www.google.com/maps?q=Menara+Zurich+Johor+Bahru&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Quick Enquiry */}
        <section className="mt-16">
          <PQuickEnquiry />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MalaysiaContact;