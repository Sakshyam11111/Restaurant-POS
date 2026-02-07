import React from 'react'
import { motion } from 'framer-motion'

const DashboardImg = () => {
  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <motion.img
        src="./dashboardimg.jpg"
        alt="Dashboard preview"
        className="h-3/4 w-auto rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.85, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ 
          scale: 1.04,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.4 }
        }}
      />
    </div>
  )
}

export default DashboardImg