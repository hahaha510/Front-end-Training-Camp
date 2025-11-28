import { useStore } from '../../store/useStore';

export default function Pagination() {
  const { page, pageSize, total, setPage } = useStore();
  
  const totalPages = Math.ceil(total / pageSize);
  
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  
  const handlePageClick = (p: number) => {
    setPage(p);
  };
  
  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // 显示的页码数量
    
    if (totalPages <= showPages + 2) {
      // 页数少，显示全部
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 页数多，显示省略号
      pages.push(1);
      
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-8">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
      >
        ← 上一页
      </button>
      
      <div className="flex items-center gap-2">
        {getPageNumbers().map((p, idx) => (
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => handlePageClick(p)}
              className={`min-w-[40px] h-10 text-sm font-medium border-2 rounded-lg transition-all ${
                page === p
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-110'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className="px-2 text-gray-400 font-bold">
              {p}
            </span>
          )
        ))}
      </div>
      
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-5 py-2.5 text-sm font-medium border-2 border-gray-300 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
      >
        下一页 →
      </button>
      
      <div className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <span className="text-sm font-medium text-gray-700">
          共 <span className="text-blue-600 font-bold">{total}</span> 件商品 / 每页 <span className="text-purple-600 font-bold">{pageSize}</span> 件
        </span>
      </div>
    </div>
  );
}
