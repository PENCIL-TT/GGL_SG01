import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MalaysiaHome = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">GGL Malaysia</h1>
            <p className="text-xl md:text-2xl mb-8">Connecting Malaysia to the World</p>
            <Link to="/malaysia/contact">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Welcome to GGL Malaysia</h2>
              <p className="text-gray-600 mb-4">
                GGL (Singapore) Pte Ltd extends its world-class logistics services to Malaysia, 
                offering comprehensive supply chain solutions tailored to the region's unique needs.
              </p>
              <p className="text-gray-600">
                With offices in Port Klang and Pasir Gudang, we are strategically positioned to handle 
                your import and export requirements with efficiency and reliability.
              </p>
            </div>
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
               <span className="text-gray-400 font-medium">Malaysia Operations</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaHome;