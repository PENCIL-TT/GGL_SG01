import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MalaysiaCareers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Careers at GGL Malaysia</h1>
          <p className="text-xl text-gray-600 mb-12">
            Join our dynamic team in Malaysia and help shape the future of logistics.
          </p>
          
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Current Openings</h2>
            <p className="text-gray-600 mb-6">We currently do not have any specific openings listed online for our Malaysia offices.</p>
            <p className="text-gray-600 mb-8">However, we are always looking for talented individuals. Feel free to send your resume to us.</p>
            <a href="mailto:jayesh@ggl.sg"><Button>Email Your Resume</Button></a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MalaysiaCareers;