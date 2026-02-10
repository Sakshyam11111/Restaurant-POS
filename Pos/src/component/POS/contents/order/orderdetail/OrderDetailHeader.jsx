import { ArrowLeft } from 'lucide-react';

const OrderDetailHeader = ({ order, activeTab, setActiveTab, navigate }) => {
  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pos')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold text-gray-900">
              Order #{order.kot}
            </h1>
            <span className="text-sm text-gray-400">|</span>
            <p className="text-sm text-gray-500">{order.table}</p>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100/80 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('Dishes')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'Dishes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            Dishes
          </button>

          <button
            onClick={() => setActiveTab('KOT')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'KOT'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            KOT
          </button>

          <button
            onClick={() => setActiveTab('Activity')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'Activity'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100" />
    </div>
  );
};

export default OrderDetailHeader;