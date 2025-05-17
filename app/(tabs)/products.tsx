import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: { name: string };
  stock: number;
}

interface Category {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
}

export default function ProductsScreen() {
  const { category } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) throw new Error('Ürünler alınamadı');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Ürünler alınamadı');
        console.error('Ürün çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) throw new Error('Kategoriler alınamadı');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        // kategori hatası gösterme
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => product.category?.name === category);
  const selectedCategory = categories.find(cat => cat.name === category);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price.toString(),
      image: `http://localhost:3001${product.image}`,
      category: product.category?.name,
    });

    Alert.alert(
      "Başarılı!",
      "Ürün sepetinize eklendi.",
      [
        {
          text: "Alışverişe Devam Et",
          style: "cancel"
        },
        { 
          text: "Sepete Git", 
          onPress: () => router.push("/cart")
        }
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2980b9" style={{ flex: 1, marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        {selectedCategory && selectedCategory.image && (
          <Image source={{ uri: `http://localhost:3001${selectedCategory.image}` }} style={styles.categoryImage} />
        )}
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      <View style={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <TouchableOpacity 
            key={product.id} 
            style={styles.productCard}
            onPress={() => router.push({
              pathname: '/product-detail',
              params: {
                id: product.id.toString(),
                name: product.name,
                price: product.price.toString(),
                image: `http://localhost:3001${product.image}`,
                description: product.description,
                category: product.category?.name,
              },
            })}
          >
            <Image source={{ uri: `http://localhost:3001${product.image}` }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>₺{product.price}</Text>
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={(e) => {
                  e.stopPropagation(); // Kartın tıklanmasını engelle
                  handleAddToCart(product);
                }}
              >
                <Ionicons name="cart-outline" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Sepete Ekle</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  categoryImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  productsGrid: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  productImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2c3e50',
  },
  productDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2980b9',
    padding: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
}); 