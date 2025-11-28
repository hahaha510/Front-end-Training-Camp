// src/mock/products.ts
import type { Product } from '../types';

const products: Product[] = Array.from({ length: 24 }).map((_, i) => {
  const id = `p-${i + 1}`;
  const categories = ['男装', '女装', '鞋靴', '配饰'];
  const category = categories[i % categories.length];
  const price = Math.round((20 + Math.random() * 480) * 100) / 100;
  const sales = Math.floor(Math.random() * 10000);
  const stock = Math.floor(Math.random() * 100);
  const title = `${category} 示例商品 ${i + 1}`;
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
  const image = `https://picsum.photos/seed/${i + 1}/640/480`;
  const specs = { size: ['S', 'M', 'L', 'XL'], color: ['黑', '白', '蓝'] };
  return { id, title, price, category, sales, createdAt, image, stock, specs };
});

export default products;
