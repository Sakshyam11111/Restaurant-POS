import React from 'react'
import { motion } from 'framer-motion'

const MagicSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const leftVariants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const rightVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      className="bg-[#F8FAFC] max-w-full mx-auto px-6 lg:px-8 py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div variants={leftVariants}>
          <h2 className="text-5xl lg:text-[46px] font-regular text-gray-900 leading-tight ml-20">
            More magic, more money. Automatically.
          </h2>
        </motion.div>

        <motion.div variants={rightVariants}>
          <p className="text-lg lg:text-[18px] text-gray-700 leading-relaxed">
            Bollore is an all-in-one POS system that helps you boost revenue and deliver
            lightning-fast, personalized service to every customer, turning one-time
            visitors into loyal regulars automatically.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MagicSection