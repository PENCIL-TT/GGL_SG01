import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import MSidebar from '@/components/MSidebar';

const MalaysiaGlobalPresence = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Global Presence</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            From our hubs in Malaysia, we connect you to GGL's extensive global network, 
            ensuring your cargo reaches any corner of the world.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1"><MSidebar isOpen={true} onClose={() => {}} /></div>
             <div className="lg:col-span-2 bg-gray-100 rounded-xl min-h-[500px] flex items-center justify-center text-gray-500">Global Map Visualization</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaGlobalPresence;