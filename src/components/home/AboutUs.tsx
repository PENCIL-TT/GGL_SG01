import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchAboutUsRecord, AboutUsRecord } from "@/lib/aboutUs";

const AboutUs = () => {
  const [data, setData] = useState<AboutUsRecord>({
    country_code: "SG",
    title: "About Us",
    content_paragraph_1: "At GGL, we are proud to be one of Singapore's leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.",
    content_paragraph_2: "We are dedicated to fostering deep, collaborative relationships with our clients, and creating genuine partnerships that drive mutual growth. Our work goes beyond forwarding and logistics; it's about building trust with our customers by delivering world-class service and solutions.",
    image_url: "/lovable-uploads/3c0c858f-8cb2-4284-b2f7-ea7bf2b6d6df.png",
    button_text: "Learn More",
    learn_more_path: "/about"
  });

  useEffect(() => {
    fetchAboutUsRecord("SG")
      .then(res => {
        if (res) setData(res);
      })
      .catch(err => console.log("Using default local About Us SG content:", err));
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
            <p className="text-gray-600 mb-4 text-base text-justify">
              {data.content_paragraph_1}
            </p>
            <p className="text-gray-600 mb-6 text-base text-justify">
              {data.content_paragraph_2}
            </p>
            <Link to={data.learn_more_path}>
              <Button variant="outline" size="sm" className="text-sm">
                {data.button_text}
              </Button>
            </Link>
          </motion.div>

          {/* Image Section */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.7,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-lg shadow-lg">
              <img alt={data.title} loading="lazy" className="w-full h-full object-cover rounded-lg" src={data.image_url} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};

export default AboutUs;