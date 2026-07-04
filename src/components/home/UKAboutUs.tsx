import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAboutUsRecord, AboutUsRecord } from "@/lib/aboutUs";

interface UKAboutUsProps {
  learnMorePath?: string;
  imageSrc?: string;
}

const UKAboutUs = ({
  learnMorePath = "/uk/about",
  imageSrc = "/Uabout.png",
}: UKAboutUsProps) => {
  const [data, setData] = useState<AboutUsRecord>({
    country_code: "UK",
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in logistics and consolidation. With a robust presence in the UK and across the globe, we offer streamlined services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "Strategically positioned to serve the UK market, GGL connects businesses to key global ports and hubs. Our expansive network ensures fast, reliable, and cost-effective options for freight forwarders and logistics providers.",
    image_url: imageSrc,
    button_text: "Learn More",
    learn_more_path: learnMorePath
  });

  useEffect(() => {
    fetchAboutUsRecord("UK")
      .then(res => {
        if (res) setData(res);
      })
      .catch(err => console.log("Using default local About Us UK content:", err));
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
        >
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{data.title}</h2>
            <p className="text-gray-600 mb-4 text-base text-justify">
              {data.content_paragraph_1}
            </p>
            <p className="text-gray-600 mb-6 text-base text-justify">
              {data.content_paragraph_2}
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-lg shadow-lg">
              <img alt={data.title} loading="lazy" className="w-full h-full object-cover rounded-lg" src={data.image_url} />
            </div>
          </motion.div>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Our History in the UK</h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-12"></div>
          <p className="text-gray-600 mb-4 text-base text-justify max-w-4xl mx-auto">
            GGL established its presence in the United Kingdom to serve as a critical link in our global logistics network. Our London office was strategically opened to provide enhanced support for our clients operating in Europe and to facilitate seamless trade between the UK and our other key markets in Asia, the Middle East, and North America.
          </p>
          <p className="text-gray-600 text-base text-justify max-w-4xl mx-auto">
            Since our inception in the UK, we have focused on building strong relationships with local partners and carriers, allowing us to offer competitive rates and reliable services. Our UK team is dedicated to providing the same high standard of customer service and operational excellence that GGL is known for worldwide.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
export default UKAboutUs;
