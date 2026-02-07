import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isMenuOpen, setIsMenuOpen, scrollYProgress, goToJoinUs }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

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
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img
                src="./Logo.webp"
                className="h-20 w-auto"
                alt="Logo"
              />
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {['Home', 'Solutions', 'Features', 'Testimonials'].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item === 'Home' ? (
                    <button
                      onClick={handleHomeClick}
                      className="text-black hover:text-[#3673B4] font-medium text-[18px] transition bg-transparent border-none cursor-pointer"
                    >
                      {item}
                    </button>
                  ) : (
                    <button
                      onClick={() => scrollToSection(sectionId)}
                      className="text-black hover:text-[#3673B4] font-medium text-[18px] transition bg-transparent border-none cursor-pointer"
                    >
                      {item}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <motion.button
                  className="hidden sm:flex items-center gap-2 text-[#3673B4] text-[18px] font-medium hover:text-[#2a5a94] transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToJoinUs}
                className="bg-[#386890] text-white px-6 py-2 rounded-lg font-regular text-[18px]"
              >
                Start for Free 
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            {['Home', 'Solutions', 'Features', 'Testimonials'].map((item) => (
              <div key={item}>
                {item === 'Home' ? (
                  <button
                    onClick={handleHomeClick}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                ) : (
                  <a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                )}
              </div>
            ))}

            <Link to="/login">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-[#3673B4] font-medium hover:bg-gray-50 transition"
              >
                Login
              </button>
            </Link>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};

export default Navbar;