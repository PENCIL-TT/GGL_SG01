import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const MalaysiaAbout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">About GGL Malaysia</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              GGL Malaysia is a key part of the GGL (Singapore) Pte Ltd network, dedicated to providing 
              seamless logistics and supply chain solutions across the region.
            </p>
            <p className="mb-6">
              Our presence in Malaysia, with strategic offices in Port Klang and Pasir Gudang, allows us 
              to offer localized expertise backed by global resources. We specialize in connecting 
              Malaysian businesses to international markets through efficient air, sea, and land transportation.
            </p>
            <p>
              We are committed to excellence, reliability, and customer satisfaction, ensuring that your 
              cargo reaches its destination safely and on time.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaAbout;