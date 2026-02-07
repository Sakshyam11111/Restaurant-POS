import React from 'react';
import { motion } from 'framer-motion';

const FeatureCards = () => {
  const features = [
    {
      title: "Add Checkout",
      description: "Complete orders quickly with secure and accurate checkout.",
      image: "./feature1.png"
    },
    {
      title: "Add Menu",
      description: "Add customers, track orders, and manage all transactions from one place.",
      image: "./feature2.png"
    },
    {
      title: "Add Dashboard",
      description: "Get a real-time overview of sales, orders, and restaurant performance.",
      image: "./feature3.png"
    }
  ];

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.12)",
      transition: {
        duration: 0.35,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.08, opacity: 0.7 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.9, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, margin: "-40px" }}
            custom={index}
          >
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-50">
              <motion.img
                src={feature.image}
                alt={feature.title}
                className="w-full h-48 object-cover"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              {feature.description}
            </p>

            <a
              href="#"
              className="inline-flex items-center text-sm font-semibold text-black hover:underline transition-colors"
            >
              Start a 7-day Free Trial
              <span className="ml-1.5">→</span>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;