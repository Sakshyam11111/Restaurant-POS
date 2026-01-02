// Footer.js
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#3673B4] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">RMS</span>
            </div>
            <p className="text-gray-400 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
          </motion.div>

          {['OUR LINKS', 'OTHER LINKS', 'CONTACT'].map((title, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <h4 className="font-bold mb-4">{title}</h4>
              {title === 'CONTACT' ? (
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li className="flex items-start gap-2"><MapPin className="w-5 h-5 mt-0.5" />123 Kathmandu, Nepal</li>
                  <li className="flex items-center gap-2"><Phone className="w-5 h-5" />+977 98 xxxx xxxx</li>
                  <li className="flex items-center gap-2"><Mail className="w-5 h-5" />info@RMS.com</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-gray-400 text-sm">
                  {['Home', 'About Us', 'Services', 'Team', 'Blog'].map((link) => (
                    <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
                  ))}
                </ul>
              )}
              {title === 'CONTACT' && (
                <div className="flex gap-3 mt-4">
                  {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.2, backgroundColor: '#3673B4' }}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p>Copyright 2026 All right reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;