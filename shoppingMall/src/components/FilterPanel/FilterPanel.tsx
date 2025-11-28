import { useState } from 'react';
import { useStore } from '../../store/useStore';

const categories = ['男装', '女装', '鞋靴', '配饰'];

export default function FilterPanel() {
  const { filters, setFilters } = useStore();
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleCategoryClick = (category: string) => {
    setFilters({ category: filters.category === category ? null : category });
  };

  const handlePriceFilter = () => {
    setFilters({
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
    });
  };

  const handleReset = () => {
    setPriceMin('');
    setPriceMax('');
    setFilters({ category: null, priceMin: null, priceMax: null });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24">
      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
        <span>🔍</span> 筛选条件
      </h3>
      
      {/* 分类 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
          商品分类
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                filters.category === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-102'
              }`}
            >
              {filters.category === category && '✓ '}{category}
            </button>
          ))}
        </div>
      </div>

      {/* 价格区间 */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
          价格区间
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="最低价"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <span className="text-gray-400 font-bold">~</span>
          <input
            type="number"
            placeholder="最高价"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          onClick={handlePriceFilter}
          className="w-full px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium"
        >
          应用价格筛选
        </button>
      </div>

      {/* 重置按钮 */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700 hover:scale-105"
      >
        🔄 重置所有筛选
      </button>
    </div>
  );
}
