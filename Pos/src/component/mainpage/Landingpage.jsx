// LandingPage.js (Updated)
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight, Star, ShoppingBag, Clock, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const navigate = useNavigate();

  const goToJoinUs = () => navigate('/joinus');

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail('');
    }
  };

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

  const floatVariant = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const floatDelayed = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        scrollYProgress={scrollYProgress} 
        goToJoinUs={goToJoinUs} 
      />

      {/* All the existing sections except navbar and footer */}
      <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* ... existing home section content ... */}
      </section>

      {/* ... all other sections ... */}

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3673B4] to-[#2a5a94]">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Subscribe To Our Newsletter</h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-8">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 transition"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubscribe}
              className="bg-white text-[#3673B4] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition"
            >
              SUBSCRIBE
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;