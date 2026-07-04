import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Ship, Plane, Package } from 'lucide-react';

const services = [
  { title: "Ocean Freight", icon: Ship, link: "/malaysia/services/ocean-freight", desc: "Comprehensive sea freight solutions." },
  { title: "Air Freight", icon: Plane, link: "/malaysia/services/air-freight", desc: "Fast and reliable air cargo services." },
  { title: "Land Transportation", icon: Truck, link: "/malaysia/services/transportation", desc: "Efficient road transport across Malaysia." },
  { title: "Warehousing", icon: Package, link: "/malaysia/services/warehousing", desc: "Secure storage and distribution." },
];

const MalaysiaServices = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Services in Malaysia</h1>
            <p className="text-xl text-gray-600">Comprehensive logistics solutions tailored for your business</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="block group">
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 h-full">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                    <service.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.desc}</p>
                  <div className="flex items-center text-red-600 font-medium">
                    Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">Looking for something else?</p>
            <Link to="/malaysia/contact" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Contact Our Team</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaServices;