import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import ProductCard from '../../components/ProductCard/ProductCard';
import { message } from 'antd';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToCart } = useStore();
  
  const product = allProducts.find((p) => p.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [quantity, setQuantity] = useState(1);

  // 推荐商品（随机4-6个其他商品）
  const recommendedProducts = allProducts
    .filter((p) => p.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4 + Math.floor(Math.random() * 3));

  useEffect(() => {
    if (product) {
      // 初始化默认规格选择
      const defaultSpecs = {};
      Object.keys(product.specs).forEach((key) => {
        defaultSpecs[key] = product.specs[key][0];
      });
      setSelectedSpecs(defaultSpecs);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500">商品不存在</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回商品列表
        </button>
      </div>
    );
  }

  // 模拟多张图片
  const images = [product.image, product.image, product.image, product.image, product.image];

  const handleSpecChange = (specKey, value) => {
    setSelectedSpecs({ ...selectedSpecs, [specKey]: value });
  };

  const handleAddToCart = () => {
    // 检查是否所有规格都已选择
    const allSelected = Object.keys(product.specs).every((key) => selectedSpecs[key]);
    if (!allSelected) {
      message.warning('请选择完整的商品规格');
      return;
    }

    addToCart(product, quantity, selectedSpecs);
    message.success('已加入购物车');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* 左侧：主图轮播区 */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 shadow-xl group">
              <img
                src={images[currentImage]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* 缩略图 */}
            <div className="flex gap-3 justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-20 h-20 border-2 rounded-xl overflow-hidden transition-all hover:scale-110 ${
                    currentImage === idx ? 'border-blue-600 ring-2 ring-blue-200 scale-110 shadow-lg' : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：信息与规格选择区 */}
          <div>
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full mb-4 shadow-md">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
              {product.title}
            </h1>

            <div className="mb-8 p-6 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl border-2 border-red-200 shadow-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-lg text-gray-600">价格</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-red-600 font-bold text-sm">¥</span>
                  <span className="text-5xl font-bold text-red-600">{product.price}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  已售 <span className="font-bold text-orange-600">{product.sales}</span>
                </span>
                <span className="flex items-center gap-1">
                  📦 库存 <span className="font-bold text-green-600">{product.stock}</span>
                </span>
              </div>
            </div>

            {/* 规格选择 */}
            {Object.keys(product.specs).map((specKey) => (
              <div key={specKey} className="mb-6">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  {specKey === 'size' ? '📏 选择尺码' : specKey === 'color' ? '🎨 选择颜色' : specKey}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.specs[specKey].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleSpecChange(specKey, value)}
                      className={`px-5 py-3 border-2 rounded-xl font-medium transition-all ${
                        selectedSpecs[specKey] === value
                          ? 'border-blue-600 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105'
                      }`}
                    >
                      {selectedSpecs[specKey] === value && '✓ '}{value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* 提示文字 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500">💡</span>
                <span>请选择完整的商品规格后加入购物车，库存充足，支持7天无理由退换货</span>
              </p>
            </div>

            {/* 数量选择和加购按钮 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-700 mr-3">数量</span>
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all font-bold text-gray-700"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border-x-2 border-gray-300 py-3 font-bold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all font-bold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-bold text-lg flex items-center justify-center gap-2"
              >
                🛒 加入购物车
              </button>
            </div>

            {/* 购物车提示 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="font-medium">加入购物车后可继续购物或前往结算，我们承诺正品保障，假一赔十</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 推荐/相似商品 */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center gap-3">
          <span>✨</span>
          <span>为您推荐</span>
          <span>✨</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
            <p className="text-sm font-medium text-gray-700">
              共 <span className="text-blue-600 font-bold">{recommendedProducts.length}</span> 件精选推荐商品
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
