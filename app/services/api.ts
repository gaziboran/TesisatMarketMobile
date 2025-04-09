import { API_URL, API_KEY } from '@env';

interface ApiConfig {
  baseURL: string;
  headers: {
    'Content-Type': string;
    'Authorization': string;
  };
}

const config: ApiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${config.baseURL}/products`, {
      headers: config.headers
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${config.baseURL}/categories`, {
      headers: config.headers
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId: string) => {
  try {
    const response = await fetch(`${config.baseURL}/products?category=${categoryId}`, {
      headers: config.headers
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const fetchProductDetails = async (productId: string) => {
  try {
    const response = await fetch(`${config.baseURL}/products/${productId}`, {
      headers: config.headers
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchProductReviews = async (productId: string) => {
  try {
    const response = await fetch(`${config.baseURL}/products/${productId}/reviews`, {
      headers: config.headers
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
}; 