// src/store/useStore.ts
import { create } from 'zustand';
import type { Product } from '../types';
import productsData from '../mock/products';

type Filters = {
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  keyword: string;
};

type Sort = { key: 'price' | 'sales' | 'createdAt' | null; order: 'asc' | 'desc' };

type CartItem = { product: Product; qty: number; spec: Record<string, string> | null };

type State = {
  allProducts: Product[];
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  filters: Filters;
  sort: Sort;
  cart: CartItem[];

  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setFilters: (f: Partial<Filters>) => void;
  setSort: (s: Sort) => void;
  refreshProducts: () => void;

  addToCart: (product: Product, qty?: number, spec?: Record<string, string> | null) => void;
  removeFromCart: (index: number) => void;
  updateCartQty: (index: number, qty: number) => void;
};

export const useStore = create<State>((set, get) => ({
  allProducts: productsData,
  products: productsData.slice(0, 12),
  total: productsData.length,
  page: 1,
  pageSize: 12,
  filters: { category: null, priceMin: null, priceMax: null, keyword: '' },
  sort: { key: null, order: 'desc' },
  cart: [],

  setPage: (p) => set({ page: p }),
  setPageSize: (s) => set({ pageSize: s, page: 1 }),

  setFilters: (f) => set((state) => ({ filters: { ...state.filters, ...f }, page: 1 })),

  setSort: (s) => set({ sort: s, page: 1 }),

  refreshProducts: () => {
    const { allProducts, filters, sort, page, pageSize } = get();
    let list = [...allProducts];

    // keyword
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(k));
    }
    // category
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    // price
    if (filters.priceMin !== null) list = list.filter((p) => p.price >= filters.priceMin!);
    if (filters.priceMax !== null) list = list.filter((p) => p.price <= filters.priceMax!);

    // sort
    if (sort.key) {
      const sortKey = sort.key as 'price' | 'sales' | 'createdAt'; // TypeScript 类型保护
      list.sort((a, b) => {
        if (sortKey === 'createdAt') {
          return sort.order === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return sort.order === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
      });
    }

    const total = list.length;
    const start = (page - 1) * pageSize;
    const pageData = list.slice(start, start + pageSize);
    set({ products: pageData, total });
  },

  addToCart: (product, qty = 1, spec = null) =>
    set((state) => {
      const idx = state.cart.findIndex((i) => i.product.id === product.id && JSON.stringify(i.spec) === JSON.stringify(spec));
      const newCart = [...state.cart];
      if (idx >= 0) {
        newCart[idx] = { ...newCart[idx], qty: newCart[idx].qty + qty };
      } else {
        newCart.push({ product, qty, spec });
      }
      return { cart: newCart };
    }),

  removeFromCart: (index) =>
    set((state) => {
      const newCart = state.cart.slice();
      newCart.splice(index, 1);
      return { cart: newCart };
    }),

  updateCartQty: (index, qty) =>
    set((state) => {
      const newCart = state.cart.slice();
      if (newCart[index]) newCart[index] = { ...newCart[index], qty };
      return { cart: newCart };
    }),
}));
