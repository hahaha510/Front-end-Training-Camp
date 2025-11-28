import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ShoppingCartOutlined } from '@ant-design/icons';

export default function NavBar() {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/products" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            🛍️ 时尚商城
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-all hover:scale-105 relative group"
            >
              商品列表
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <button className="relative text-gray-700 hover:text-blue-600 transition-all hover:scale-110 p-2 rounded-full hover:bg-blue-50">
              <ShoppingCartOutlined className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
