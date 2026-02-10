import { motion } from 'framer-motion';

const DishCard = ({ item, index, onClick }) => {
  const getStatusBadge = () => {
    if (item.status === 'Completed') {
      return (
        <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg z-10">
          Completed
        </span>
      );
    }
    if (item.status === 'Cancelled') {
      return (
        <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg z-10">
          Cancelled
        </span>
      );
    }
    if (item.status === 'Pending') {
      return (
        <span className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg z-10">
          Pending
        </span>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border border-gray-100 relative"
      onClick={onClick}
    >
      {getStatusBadge()}
      
      <div className="aspect-video relative bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        {item.image?.includes('default') ? (
          <span className="text-6xl">🍔</span>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg flex-1">{item.name}</h3>
          <span className="text-gray-900 font-bold text-lg ml-2">Rs {item.price}</span>
        </div>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {item.description}
        </p>

        {item.note && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">Note: {item.note}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {item.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Qty:</span>
            <span className="text-base font-semibold text-gray-900">{item.qty}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;