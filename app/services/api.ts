import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export default api; 