// src/types.d.ts
export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  sales: number;
  createdAt: string;
  image: string;
  stock: number;
  specs: Record<string, string[]>;
}
