import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductCard from '../../components/ProductCard/ProductCard';
import Pagination from '../../components/Pagination/Pagination';

export default function ProductList() {
  const { products, total, filters, sort, setSort, refreshProducts } = useStore();
  const [keyword, setKeyword] = useState('');
  const { setFilters } = useStore();

  // 初始化和筛选变化时刷新商品列表
  useEffect(() => {
    refreshProducts();
  }, [filters, sort, refreshProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ keyword });
  };

  const handleSortChange = (key) => {
    if (sort.key === key) {
      // 切换排序方向
      setSort({ key, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, order: 'desc' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 搜索栏 */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="🔍 搜索你想要的商品..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all font-medium"
            >
              搜索
            </button>
          </div>
        </form>
      </div>

      <div className="flex gap-6">
        {/* 左侧筛选面板 */}
        <aside className="w-64 flex-shrink-0">
          <FilterPanel />
        </aside>

        {/* 右侧商品列表 */}
        <main className="flex-1">
          {/* 排序和统计 */}
          <div className="flex flex-wrap items-center justify-between mb-6 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-md border border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">📊 排序方式：</span>
              <button
                onClick={() => handleSortChange('price')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  sort.key === 'price'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105'
                }`}
              >
                💰 价格 {sort.key === 'price' && (sort.order === 'asc' ? '↑' : '↓')}
              </button>
              
              <button
                onClick={() => handleSortChange('sales')}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  sort.key === 'sales'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105'
                }`}
              >
                🔥 销量 {sort.key === 'sales' && (sort.order === 'asc' ? '↑' : '↓')}
              </button>
            </div>
            
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-blue-200">
              <span className="text-sm font-medium text-gray-700">
                共找到 <span className="text-blue-600 font-bold text-lg">{total}</span> 件商品
              </span>
            </div>
          </div>

          {/* 商品网格 */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-500 font-medium">未找到符合条件的商品</p>
              <p className="text-sm text-gray-400 mt-2">试试调整筛选条件或搜索关键词</p>
            </div>
          )}

          {/* 分页 */}
          <Pagination />
        </main>
      </div>
    </div>
  );
}
