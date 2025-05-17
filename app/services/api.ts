import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı header'a ekle
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Kategoriler alınırken hata:', error);
    throw error;
  }
};

export const getProducts = async (categoryId?: number) => {
  try {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Ürünler alınırken hata:', error);
    throw error;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Ürün detayı alınırken hata:', error);
    throw error;
  }
};

// --- SEPET API ---
export const addToCart = async (productId: number, quantity: number = 1) => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    const { id: userId } = JSON.parse(user);
    const response = await api.post('/cart', { productId, quantity, userId });
    return response.data;
  } catch (error) {
    console.error('Sepete ekleme hatası:', error);
    throw error;
  }
};

export const removeFromCart = async (cartId: number) => {
  try {
    const response = await api.delete(`/cart/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Sepetten silme hatası:', error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      throw new Error('Kullanıcı girişi yapılmamış');
    }
    const { id: userId } = JSON.parse(user);
    const response = await api.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Sepet getirme hatası:', error);
    throw error;
  }
};

export const updateCartQuantity = async (cartId: number, quantity: number) => {
  try {
    const response = await api.patch(`/cart/${cartId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Sepet güncelleme hatası:', error);
    throw error;
  }
};

export default api; 