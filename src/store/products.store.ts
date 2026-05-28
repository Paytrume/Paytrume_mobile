import { create } from 'zustand';
import {
  cloneProduct,
  completeServiceStage,
  createProduct,
  // editProduct,
  deleteProduct,
  filterProducts,
  getBuyerProducts,
  getOneProduct,
  getSellerProducts,
  requestRefund,
  requestServiceCompletion,
  searchProducts,
  updateProduct,
} from '../services/api';
import { getStatus } from '@/utils/string';

export interface Product {
  _id: string;
  title: string;
  description: string;
  amount: string;
  status: 'in_escrow' | 'awaiting_pay' | 'completed';
  date?: string;
  payment_link?: string;
  type?: 'goods' | 'services';
  product_images?: string;
  customer_paid?: { status: boolean };
  createdAt?: string;
  [key: string]: any;
}

export interface ProductsState {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
  hasNextPage: boolean;
  product?: Product | null;

  // Buyer Products State
  buyerProducts: Product[];
  buyerTotalProducts: number;
  buyerTotalPages: number;
  buyerCurrentPage: number;
  buyerItemsPerPage: number;
  buyerIsLoading: boolean;
  buyerError: string | null;
  buyerHasNextPage: boolean;

  // Actions
  fetchProducts: (page?: number) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  getSingleProduct: (id: string) => Promise<void>;
  resetProducts: () => void;
  createNewProduct: (productData: any) => Promise<void>;
  cloneExistingProduct: (id: string, productData: any) => Promise<void>;
  updateProductById: (id: string, productData: any) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  searchProductsByKeyword: (keyword: string, page?: number) => Promise<void>;
  filterProductsByUrl: (url: string) => Promise<void>;
  requestServicePayout: (id: string) => Promise<void>;
  approveServiceCompletion: (id: string, payload: any) => Promise<void>;
  refundTransaction: (id: string, payload: any) => Promise<void>;
  message: string | null;
  clearMessage: () => void;

  // Buyer Products Actions
  fetchBuyerProducts: (page?: number) => Promise<void>;
  loadMoreBuyerProducts: () => Promise<void>;
  resetBuyerProducts: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  totalProducts: 0,
  totalPages: 0,
  currentPage: 0,
  itemsPerPage: 100,
  isLoading: false,
  error: null,
  hasNextPage: false,
  message: null,

  // Buyer Products Initial State
  buyerProducts: [],
  buyerTotalProducts: 0,
  buyerTotalPages: 0,
  buyerCurrentPage: 0,
  buyerItemsPerPage: 100,
  buyerIsLoading: false,
  buyerError: null,
  buyerHasNextPage: false,

  fetchProducts: async (page = 0) => {
    // Clear products when starting fresh fetch (page 0)
    const shouldClear = page === 0;
    set({ isLoading: true, error: null, ...(shouldClear && { products: [] }) });
    try {
      const response = await getSellerProducts(page);

      // Map backend response fields to frontend Product interface
      const mappedProducts = (response.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item, // Include all other fields
      }));

      set({
        products: mappedProducts,
        totalProducts: response.totalProducts || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || page,
        itemsPerPage: response.itemsPerPage || 100,
        hasNextPage: !!response.next,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      // Clear products on error if this was a fresh fetch (page 0)
      set({
        error: errorMessage,
        isLoading: false,
        ...(page === 0 && { products: [] }),
      });
    }
  },

  loadMoreProducts: async () => {
    const { currentPage, totalPages, products } = get();

    // Don't load if already at last page or loading
    if (currentPage >= totalPages - 1 || get().isLoading) {
      return;
    }

    try {
      set({ isLoading: true });
      const response = await getSellerProducts(currentPage + 1);

      // Map backend response fields to frontend Product interface
      const mappedProducts = (response.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item,
      }));

      set({
        products: [...products, ...mappedProducts],
        totalProducts: response.totalProducts || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || currentPage + 1,
        hasNextPage: !!response.next,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more products';
      set({ error: errorMessage, isLoading: false });
    }
  },

  getSingleProduct: async (productId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getOneProduct(productId);
      const data = response.data;
      data.status = getStatus(data);
      set({ product: data, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createNewProduct: async (productData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await createProduct(productData);
      if (response.success) {
        set({ message: response.message || 'Product created successfully', isLoading: false });
        // Refresh products list
        await get().fetchProducts(0);
      } else {
        set({ error: response.message || 'Failed to create product', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  cloneExistingProduct: async (id, productData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await cloneProduct(id, productData);
      if (response.success) {
        set({ message: response.message || 'Product cloned successfully', isLoading: false });
        await get().fetchProducts(0);
      } else {
        set({ error: response.message || 'Failed to clone product', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clone product';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateProductById: async (id, productData) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await updateProduct(id, productData);
      if (response.success) {
        set({ message: response.message || 'Product updated successfully', isLoading: false });
        await get().fetchProducts(get().currentPage);
      } else {
        set({ error: response.message || 'Failed to update product', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeProduct: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        set({ message: response.message || 'Product deleted successfully', isLoading: false });
        await get().fetchProducts(0);
      } else {
        set({ error: response.message || 'Failed to delete product', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchProductsByKeyword: async (keyword, page = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await searchProducts(keyword, page);
      const mappedProducts = (response.data?.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item,
      }));

      set({
        products: mappedProducts,
        totalProducts: response.data?.totalProducts || 0,
        totalPages: response.data?.totalPages || 0,
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products';
      set({ error: errorMessage, isLoading: false });
    }
  },

  filterProductsByUrl: async (url) => {
    set({ isLoading: true, error: null });
    try {
      const response = await filterProducts(url);
      const mappedProducts = (response.data?.products || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item,
      }));

      set({
        products: mappedProducts,
        totalProducts: response.data?.total || 0,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to filter products';
      set({ error: errorMessage, isLoading: false });
    }
  },

  requestServicePayout: async (id) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await requestServiceCompletion(id);
      if (response.success) {
        set({ message: response.message || 'Service completion requested', isLoading: false });
      } else {
        set({ error: response.message || 'Failed to request service completion', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request service completion';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  approveServiceCompletion: async (id, payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await completeServiceStage(id, payload);
      if (response.success) {
        set({ message: response.message || 'Service completed successfully', isLoading: false });
      } else {
        set({ error: response.message || 'Failed to complete service', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete service';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  refundTransaction: async (id, payload) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await requestRefund(id, payload);
      if (response.success) {
        set({ message: response.message || 'Refund requested successfully', isLoading: false });
      } else {
        set({ error: response.message || 'Failed to request refund', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request refund';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearMessage: () => set({ message: null }),

  resetProducts: () => {
    set({
      products: [],
      totalProducts: 0,
      totalPages: 0,
      currentPage: 0,
      itemsPerPage: 100,
      isLoading: false,
      error: null,
      hasNextPage: false,
    });
  },

  // Buyer Products Actions
  fetchBuyerProducts: async (page = 0) => {
    set({ buyerIsLoading: true, buyerError: null });
    try {
      const response = await getBuyerProducts(page);

      // Map backend response fields to frontend Product interface
      const mappedProducts = (response.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item, // Include all other fields
      }));

      set({
        buyerProducts: mappedProducts,
        buyerTotalProducts: response.totalProducts || 0,
        buyerTotalPages: response.totalPages || 0,
        buyerCurrentPage: response.currentPage || page,
        buyerItemsPerPage: response.itemsPerPage || 100,
        buyerHasNextPage: !!response.next,
        buyerIsLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buyer products';
      set({ buyerError: errorMessage, buyerIsLoading: false });
    }
  },

  loadMoreBuyerProducts: async () => {
    const { buyerCurrentPage, buyerTotalPages, buyerProducts } = get();

    // Don't load if already at last page or loading
    if (buyerCurrentPage >= buyerTotalPages - 1 || get().buyerIsLoading) {
      return;
    }

    try {
      set({ buyerIsLoading: true });
      const response = await getBuyerProducts(buyerCurrentPage + 1);

      // Map backend response fields to frontend Product interface
      const mappedProducts = (response.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: getStatus(item),
        date: item.createdAt,
        payment_link: item.payment_link,
        type: item.type,
        product_images: item.product_images,
        customer_paid: item.customer_paid,
        createdAt: item.createdAt,
        ...item,
      }));

      set({
        buyerProducts: [...buyerProducts, ...mappedProducts],
        buyerTotalProducts: response.totalProducts || 0,
        buyerTotalPages: response.totalPages || 0,
        buyerCurrentPage: response.currentPage || buyerCurrentPage + 1,
        buyerHasNextPage: !!response.next,
        buyerIsLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more buyer products';
      set({ buyerError: errorMessage, buyerIsLoading: false });
    }
  },

  resetBuyerProducts: () => {
    set({
      buyerProducts: [],
      buyerTotalProducts: 0,
      buyerTotalPages: 0,
      buyerCurrentPage: 0,
      buyerItemsPerPage: 100,
      buyerIsLoading: false,
      buyerError: null,
      buyerHasNextPage: false,
    });
  },
}));
