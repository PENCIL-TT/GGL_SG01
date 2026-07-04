import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import PQuickEnquiry from "@/components/home/PQuickEnquiry";
import SEO from '@/components/SEO';

const pakistanNavPaths = {
  home: "/pakistan",
  about: "/pakistan/about",
  services: "/pakistan/services",
  careers: "/pakistan/careers",
  contact: "/pakistan/contact",
  globalPresence: "/pakistan/global-presence",
};

const PakistanContact = () => {
  const [content, setContent] = useState({
    title: "Contact Us - Pakistan",
    subtitle: "",
    email_recipient: "info.pk@ggl.sg",
    phone: "+92 21 34542881/ +92 21 34542882/ +92 21 34542883/ +92 21 34542884",
    address: "Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.",
    map_iframe_url: "https://www.google.com/maps?q=Fortune+Center+Shahrah-e-Faisal+Karachi&output=embed"
  });

  useEffect(() => {
    fetch('/api/contact-page-content/PK')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Offline");
      })
      .then(data => {
        setContent({
          title: data.title || "Contact Us - Pakistan",
          subtitle: data.subtitle || "",
          email_recipient: data.email_recipient || "info.pk@ggl.sg",
          phone: data.phone || "+92 21 34542881/ +92 21 34542882/ +92 21 34542883/ +92 21 34542884",
          address: data.address || "Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.",
          map_iframe_url: data.map_iframe_url || "https://www.google.com/maps?q=Fortune+Center+Shahrah-e-Faisal+Karachi&output=embed"
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Header navPaths={pakistanNavPaths} />

      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-12 text-brand-navy">
          {content.title}
        </h1>

        <div className="grid md:grid-cols-1 gap-8">
          {/* Karachi Office */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-brand-gold border-b pb-2">
              Karachi Office
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
                <span className="font-medium">
                  {content.email_recipient}
                </span>
              </div>
            </div>

            {/* Clean Google Map */}
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Karachi Office Map"
                src={content.map_iframe_url}
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

export default PakistanContact;
