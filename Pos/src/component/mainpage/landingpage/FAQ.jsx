import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Bollore?",
      answer:
        "Bollore is a comprehensive restaurant management software designed to streamline operations including order management, billing, inventory tracking, and customer relationship management for restaurants of all sizes."
    },
    {
      question: "What are the features of Bollore?",
      answer:
        "Bollore offers a wide range of features including digital menu management, table ordering, KOT (Kitchen Order Ticket) system, billing and invoicing, inventory management, staff management, real-time reporting, and multi-outlet support."
    },
    {
      question: "Can I use the Bollore software for free?",
      answer:
        "Yes, Bollore offers a 7-day free trial that gives you full access to all features. After the trial, you can choose from our flexible pricing plans that suit your business needs."
    },
    {
      question: "Can I manage my restaurant remotely with Bollore software?",
      answer:
        "Absolutely! Bollore is cloud-based, allowing you to monitor sales, track orders, manage inventory, and oversee operations from anywhere using your smartphone, tablet, or computer."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12 md:py-20 bg-white w-full">
      <motion.div
        className="max-w-3xl mx-auto px-4 md:px-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-10 md:mb-12" variants={item}>
          <span className="text-teal-700 font-semibold text-xs md:text-sm uppercase tracking-wider mb-2 block">
            Few Questions
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
              >
                <span className="text-teal-800 font-semibold text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;