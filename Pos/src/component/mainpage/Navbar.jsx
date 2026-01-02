// Navbar.js
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Phone, Menu, X } from 'lucide-react';

const Navbar = ({ isMenuOpen, setIsMenuOpen, scrollYProgress, goToJoinUs }) => {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#3673B4] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#3673B4] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RMS</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {['Home', 'About Us', 'Shop', 'Testimonial', 'Contact Us'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-[#3673B4] font-medium transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.a
                href="tel:+919876543210"
                className="hidden sm:flex items-center gap-2 text-[#3673B4] font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span>(+977) 98 xxxx xxxx</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToJoinUs}
                className="bg-[#3673B4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2a5a94] transition"
              >
                Join Us
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            {['Home', 'About Us', 'Shop', 'Blog', 'Contact Us'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};

export default Navbar;