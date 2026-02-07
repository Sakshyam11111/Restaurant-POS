import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const UnlockProfit = () => {
  const [activeTab, setActiveTab] = useState('restaurants')

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const contentVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.12,
      },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: { duration: 0.4 },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[48px] lg:text-[48px] font-regular text-gray-900 mb-6">
            Unlock Your Profit Potential<br />With Just A Few Clicks.
          </h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Our SaaS restaurant management platform automates back-of-house operations so you'll get fast,
            accurate reporting on inventory, COGS, and expenses.
          </p>
        </motion.div>

        <div className="flex justify-center gap-40 mb-16">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`text-[20px] font-medium pb-3 border-b-4 transition-colors duration-300 ${
              activeTab === 'restaurants'
                ? 'text-gray-900 border-[#386890]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            For Restaurants
          </button>

          <button
            onClick={() => setActiveTab('distributors')}
            className={`text-[20px] font-medium pb-3 border-b-4 transition-colors duration-300 ${
              activeTab === 'distributors'
                ? 'text-gray-900 border-[#386890]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            For Food Distributors
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`text-[20px] font-medium pb-3 border-b-4 transition-colors duration-300 ${
              activeTab === 'partners'
                ? 'text-gray-900 border-[#386890]'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            For Technology Partners
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-2 gap-48 items-center"
          >
            {activeTab === 'restaurants' && (
              <>
                <motion.div variants={tabVariants}>
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Simplify operations, reduce costs, eliminate manual paperwork, and gain clear control over your COGS.
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Whether you run a café, QSR, or hospitality group, MarketMan provides real-time pricing and
                    profitability analytics to help you stay in full control of your costs.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Pinpoint waste and maximize profits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Receive intelligent order suggestions no guesswork, less time</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={imageVariants}>
                  <img
                    src="./UnlockProfit1.png"
                    alt="Chef working in restaurant kitchen"
                    className="w-[500px] h-[400px] object-cover rounded-3xl"
                  />
                </motion.div>
              </>
            )}

            {activeTab === 'distributors' && (
              <>
                <motion.div variants={tabVariants}>
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Smarter Inventory and Ordering Anywhere, Anytime
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Automate inventory and order management to reduce manual work and improve accuracy. With ERP
                    integration, orders flow directly into your system no paperwork required. Update pricing,
                    products, and stock in the cloud and sync changes instantly across all customer touchpoints.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Mobile app for quick ordering and real-time tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Fully white-labeled app aligned with your brand identity</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={imageVariants}>
                  <img
                    src="./UnlockProfit2.png"
                    alt="Food distributor warehouse"
                    className="w-[500px] h-[400px] object-cover rounded-3xl"
                  />
                </motion.div>
              </>
            )}

            {activeTab === 'partners' && (
              <>
                <motion.div variants={tabVariants}>
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    Partner With Us
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Grow your product ecosystem and deliver more value. MarketMan’s all-in-one inventory platform
                    connects effortlessly with the industry’s most trusted technologies making integrations simple
                    and scalable.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Discover opportunities in the MarketMan Partner Marketplace</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#386890] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Easy, developer-friendly integrations no complexity</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={imageVariants}>
                  <img
                    src="./UnlockProfit3.png"
                    alt="Technology integration dashboard"
                    className="w-[500px] h-[400px] object-cover rounded-3xl"
                  />
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UnlockProfit