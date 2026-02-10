import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const DishCard = ({ item, index, onClick }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.src = '/images/default-dish.jpg';
          }}
        />
        {item.category && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
            {item.category}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="px-3 py-1 bg-blue-50 text-[#4A7BA7] rounded-lg text-sm font-medium"
          >
            {item.status}
          </motion.span>
        </div>

        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-gray-900">
              {item.price > 0 ? `Rs ${item.price}` : '—'}
            </span>
            {item.priceFromOrder > 0 && item.price !== item.priceFromOrder && (
              <span className="text-xs text-gray-500 line-through">
                Rs {item.priceFromOrder}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 flex items-center justify-center bg-[#4A7BA7] text-white rounded-xl hover:bg-[#3d6a92] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;