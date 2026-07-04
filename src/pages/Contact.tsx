import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebookF } from 'react-icons/fa';
import { Phone, MapPin, Mail, Send, XCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const Contact = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState({
    title: "Get in Touch",
    subtitle: "We're here to help and answer any questions you might have.",
    email_recipient: "June@ggl.sg",
    phone: "+65 69080838",
    address: "GGL (Singapore) Pte Ltd. Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447",
    map_iframe_url: "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1"
  });

  useEffect(() => {
    fetch('/api/contact-page-content/SG')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Offline");
      })
      .then(data => {
        setContent({
          title: data.title || "Get in Touch",
          subtitle: data.subtitle || "We're here to help and answer any questions you might have.",
          email_recipient: data.email_recipient || "June@ggl.sg",
          phone: data.phone || "+65 69080838",
          address: data.address || "GGL (Singapore) Pte Ltd. Blk 511 Kampong Bahru Road #03-01 Keppel Distripark, Singapore - 099447",
          map_iframe_url: data.map_iframe_url || "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1"
        });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${content.email_recipient}`, {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setShowNotification(true);
      form.reset();

      setTimeout(() => setShowNotification(false), 4000);
    } catch (error) {
      alert("Oops! Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <SEO />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] flex items-center justify-center bg-blue-600 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy to-brand-navy/90" />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center px-4 relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">{content.title}</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto font-light">
              {content.subtitle}
            </p>
          </motion.div>
        </motion.section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Singapore Office</h3>
                    <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 group">
                      <Phone className="mt-1 text-blue-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{content.phone}</p>
                      </div>
                    </motion.div>
                    <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 group">
                      <MapPin className="mt-1 text-blue-600 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-gray-600">
                          {content.address}
                        </p>
                      </div>
                    </motion.div>
                  </div>
               <motion.div whileHover={{ x: 10 }} className="flex items-start gap-4 group">
  <Mail className="mt-1 text-blue-600 group-hover:scale-110 transition-transform" />
  <div>
    <p className="font-medium">Email</p>
    <p className="text-gray-600">{content.email_recipient}</p>
  </div>
</motion.div>

                  {/* Social Links */}
                  <div className="pt-6 border-t">
                    <p className="font-medium mb-4">Connect With Us</p>
                    <div className="flex gap-4">
                      <motion.a
                        href="https://www.linkedin.com/company/gglus/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <FaLinkedin size={18} />
                      </motion.a>
                      <motion.a
                        href="https://www.facebook.com/gglusa"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <FaFacebookF size={18} />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* FormSubmit Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-4">Send us a Message</h2>
                <p className="text-gray-600 mb-6">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="box" />
                  <input type="hidden" name="_subject" value="New Contact Submission!" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="First Name" name="First Name" required />
                    <Input placeholder="Last Name" name="Last Name" required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Email" type="email" name="Email" required />
                    <Input placeholder="Phone" name="Phone" />
                  </div>

                  <Input placeholder="Organization/Company" name="Organization" />
                  <Textarea placeholder="Your Message" name="Message" required />

                  {/* Success Popup Notification inside form above the button */}
                  {showNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
                      role="alert"
                    >
                      <span>✅ Message sent successfully!</span>
                      <button
                        type="button"
                        onClick={() => setShowNotification(false)}
                        className="text-green-700 hover:text-green-900 focus:outline-none"
                        aria-label="Close notification"
                      >
                        <XCircle size={20} />
                      </button>
                    </motion.div>
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white py-6 flex items-center justify-center gap-2 bg-brand-navy"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Google Maps */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <MapPin className="text-blue-600" />
                Our Location
              </h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Visit us at our Singapore office location
              </p>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
              <div className="h-[500px] w-full relative">
                <iframe
                  src={content.map_iframe_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="GGL Singapore Office Location"
                />
                <div className="absolute top-0 left-0 right-0 h-14 bg-white z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-14 bg-white z-10 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
