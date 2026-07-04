import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAboutUsRecord, AboutUsRecord } from "@/lib/aboutUs";

interface PAboutUsProps {
  learnMorePath?: string;
  imageSrc?: string;
}

const PAboutUs = ({ learnMorePath = "/pakistan/about", imageSrc = "/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png" }: PAboutUsProps) => {
  const [data, setData] = useState<AboutUsRecord>({
    country_code: "PK",
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.",
    image_url: imageSrc,
    button_text: "Learn More",
    learn_more_path: learnMorePath
  });

  useEffect(() => {
    fetchAboutUsRecord("PK")
      .then(res => {
        if (res) setData(res);
      })
      .catch(err => console.log("Using default local About Us PK content:", err));
  }, []);

  return <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }} viewport={{
        once: true
      }} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Section */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{data.title}</h2>
            <p className="text-gray-600 mb-4 text-base text-justify">{data.content_paragraph_1}</p>
            <p className="text-gray-600 mb-6 text-base text-justify">{data.content_paragraph_2}</p>
            <Link to={data.learn_more_path}>
              <Button variant="outline" size="sm" className="text-sm bg-brand-gold my-0 mx-0 rounded-md font-semibold">
                {data.button_text}
              </Button>
            </Link>
          </motion.div>

          {/* Image Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }} className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-lg shadow-lg">
              <img alt={data.title} loading="lazy" className="w-full h-full object-cover rounded-lg" src={data.image_url} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};

export default PAboutUs;