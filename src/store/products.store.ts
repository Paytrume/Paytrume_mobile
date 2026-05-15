import { create } from 'zustand';
import {
  cloneProduct,
  completeServiceStage,
  createProduct,
  // editProduct,
  deleteProduct,
  filterProducts,
  getOneProduct,
  getSellerProducts,
  requestRefund,
  requestServiceCompletion,
  searchProducts,
  updateProduct,
} from '../services/api';

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

  fetchProducts: async (page = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSellerProducts(page);

      // Map backend response fields to frontend Product interface
      const mappedProducts = (response.data || []).map((item: any) => ({
        _id: item._id,
        title: item.product_name,
        description: item.product_description || 'No description',
        amount: item.product_price,
        status: item.customer_paid?.status ? 'completed' : item.payment_type === 'recurring' ? 'in_escrow' : 'awaiting_pay',
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
      set({ error: errorMessage, isLoading: false });
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
        status: item.customer_paid?.status ? 'completed' : item.payment_type === 'recurring' ? 'in_escrow' : 'awaiting_pay',
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
      set({ product: response.data, isLoading: false });
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
        status: item.customer_paid?.status ? 'completed' : item.payment_type === 'recurring' ? 'in_escrow' : 'awaiting_pay',
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
        status: item.customer_paid?.status ? 'completed' : item.payment_type === 'recurring' ? 'in_escrow' : 'awaiting_pay',
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
}));
