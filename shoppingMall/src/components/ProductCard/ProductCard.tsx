import { Link } from 'react-router-dom';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:border-blue-300"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-md">
          {product.category}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-sm text-gray-900 mb-3 line-clamp-2 min-h-[40px] font-medium group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">¥</span>
            <span className="text-red-600 font-bold text-2xl">{product.price}</span>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            热销
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <span className="text-orange-500">🔥</span>
            销量 {product.sales.toLocaleString()}
          </span>
          <span className="text-gray-400">库存 {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
