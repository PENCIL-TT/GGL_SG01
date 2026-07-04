
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Memberships = () => {
  const certifications = [{
    src: "/bifaa1.png",
    alt: "Industry Certification 1"
  }, {
    src: "/fiataa1.png",
    alt: "Industry Certification 2"
  }];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Industry Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {certifications.map((cert, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <AspectRatio ratio={16/9}>
                <img 
                  src={cert.src} 
                  alt={cert.alt} 
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Memberships;
