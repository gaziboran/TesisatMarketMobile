import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface OrderData {
    userId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
    address: string;
}

export const createOrder = async (orderData: OrderData) => {
    try {
        const response = await axios.post(`${API_URL}/orders`, orderData);
        return response.data;
    } catch (error) {
        console.error('Sipariş oluşturma hatası:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Kategorileri getirme hatası:', error);
        throw error;
    }
};

export const getCategoryById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Kategori getirme hatası:', error);
        throw error;
    }
}; 