import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#386890] to-[#386890] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Hero Section */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-light mb-2 leading-tight">
                See how your business
              </h2>
              <h2 className="text-4xl md:text-5xl font-light leading-tight">
                can succeed with Bollore
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white rounded-lg font-medium hover:bg-white hover:text-[#4A7BA7] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-[#4A7BA7] rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start a 7-days Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeInUp}
            className="border-t border-white/30 mb-12"
          />

          {/* Footer Content Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 lg:gap-24"
          >
            {/* Left Column - Brand & Description */}
            <motion.div variants={fadeInUp}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
                    <img
                      src="./logowhite.png"
                      className='w-full h-44'
                    />
                  </motion.div>
                </div>

                <p className="text-white/90 text-base mb-8 max-w-md">
                  Bollore provides restaurant management and POS software solutions
                </p>

                {/* Social Media Icons */}
                <div className="flex gap-4">
                  {[
                    { Icon: Facebook, label: 'Facebook' },
                    { Icon: Instagram, label: 'Instagram' },
                    {
                      Icon: () => (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ), label: 'X'
                    },
                    { Icon: Linkedin, label: 'LinkedIn' }
                  ].map(({ Icon, label }, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Help Center Card */}
            <motion.div variants={fadeInUp}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-3">Help Center</h3>
                <p className="text-white/80 text-sm mb-1">24/7 resources</p>

                <p className="text-white/90 text-sm leading-relaxed mb-6 mt-4">
                  Place get in touch if you need one-to-one assistance getting started with new products or have questions for our sales team.
                </p>

                <motion.a
                  href="#"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 text-white font-medium hover:underline underline-offset-4"
                >
                  Help Center
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-white/30 mb-8"
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/70 text-sm"
        >
          <p>© 2026 Bollore. All Rights Reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;