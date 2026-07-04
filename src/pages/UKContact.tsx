import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import UKQuickEnquiry from "@/components/home/UKQuickEnquiry";
import { MapPin, Phone } from "lucide-react";
import SEO from '@/components/SEO';

const ukNavPaths = {
  home: "/uk",
  about: "/uk/about",
  services: "/uk/services",
  careers: "/uk/careers",
  contact: "/uk/contact",
  globalPresence: "/uk/global-presence",
};

const UKContact = () => {
  const [content, setContent] = useState({
    title: "Contact Us - UK",
    subtitle: "",
    email_recipient: "Sukant@ggl.sg",
    phone: "+44(0)7305 856 612",
    address: "15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.",
    map_iframe_url: "https://www.google.com/maps?q=167-169+Great+Portland+Street+London+W1W+5PF&output=embed"
  });

  useEffect(() => {
    fetch('/api/contact-page-content/UK')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Offline");
      })
      .then(data => {
        setContent({
          title: data.title || "Contact Us - UK",
          subtitle: data.subtitle || "",
          email_recipient: data.email_recipient || "Sukant@ggl.sg",
          phone: data.phone || "+44(0)7305 856 612",
          address: data.address || "15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.",
          map_iframe_url: data.map_iframe_url || "https://www.google.com/maps?q=167-169+Great+Portland+Street+London+W1W+5PF&output=embed"
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO />
      <Header navPaths={ukNavPaths} />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-brand-navy">{content.title}</h1>
          
          <div className="max-w-3xl mx-auto mb-12 bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-3">
                <MapPin className="text-brand-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-600">{content.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-brand-gold w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-600">{content.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 rounded-lg overflow-hidden border border-gray-200 h-80">
              <iframe
                title="London Office Map"
                src={content.map_iframe_url}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
          
          <UKQuickEnquiry />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UKContact;
