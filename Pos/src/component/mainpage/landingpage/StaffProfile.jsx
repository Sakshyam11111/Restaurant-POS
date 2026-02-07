import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MessageSquare, Home, Monitor, BarChart3, FileText, Scale, Utensils, ThumbsUp } from 'lucide-react';

const StaffProfile = () => {
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        type: 'spring',
        stiffness: 180,
        damping: 12,
      },
    }),
  };

  const profileCardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const textBlockVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const icons = [
    Calendar, MessageSquare, Home, ThumbsUp, Utensils,
    Scale, MessageSquare, Clock, Monitor, BarChart3, FileText,
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative flex flex-col items-center">
          <motion.p
            className="text-[#386890] font-semibold mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Pos
          </motion.p>

          <div className="relative w-[500px] h-[500px] mx-auto">
            <div className="absolute inset-0">
              {icons.map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center"
                  style={{
                    top: `${[0, 15, 50, 85, 100, 85, 50, 15, 35, 65, 65][i]}%`,
                    left: `${[50, 90, 100, 90, 50, 10, 0, 10, 5, 5, 95][i]}%`,
                    transform: i === 0 || i === 4 || i === 7
                      ? 'translate(-50%, -50%)'
                      : i === 2 || i === 6
                      ? 'translate(50%, -50%)'
                      : 'translate(-50%, -50%)',
                  }}
                  variants={iconVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <Icon className="w-6 h-6 text-[#386890]" />
                </motion.div>
              ))}
            </div>

            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="250"
                cy="250"
                r="180"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity="0.3"
              />
            </svg>

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white rounded-2xl shadow-xl p-6"
              variants={profileCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                <img
                  src="/t1.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-center text-lg font-semibold text-gray-900">Riya Shrestha</h3>
              <p className="text-center text-sm text-gray-600 mb-4">Friends of Chef</p>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">Champion</span>
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">Gold Member</span>
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">GM Table Touch</span>
              </div>

              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">Regular</span>
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">Steak Lover</span>
                <span className="px-3 py-1 bg-[#386890] text-white text-xs rounded-md">Allergy</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center mb-4">
                <div>
                  <p className="text-xs text-gray-600">Total Spend</p>
                  <p className="text-sm font-semibold">Rs 8,000</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">No. of Orders</p>
                  <p className="text-sm font-semibold">30</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Visits</p>
                  <p className="text-sm font-semibold">22</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Reviews</p>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#386890] text-white rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Order Details</span>
                  <span className="text-xs">View All</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Momo</span>
                    <span>Rs 120</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Burger</span>
                    <span>Rs 220</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="flex flex-col items-center"
          variants={textBlockVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-[#386890] font-semibold mb-4">Pos</p>
          <h1 className="text-[48px] font-regular text-black mb-6">
            Smart Staff Profiles<br />Powered by Your POS
          </h1>
          <p className="text-gray-600 text-[18px]">
            Automatically manage staff data directly from your POS. Maintain a unified staff database enhanced with
            100+ integrations and an open API to improve scheduling, accountability, and operational efficiency.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffProfile;