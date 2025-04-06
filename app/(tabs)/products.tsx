import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Musluk Bataryası',
    price: '299.99',
    image: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=800&q=80',
    description: 'Modern tasarım, uzun ömürlü',
    category: 'Su Tesisatı',
  },
  {
    id: '2',
    name: 'LED Panel',
    price: '159.99',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    description: 'Enerji tasarruflu, parlak ışık',
    category: 'Elektrik',
  },
  {
    id: '3',
    name: 'Elektrikli Şofben',
    price: '899.99',
    image: 'https://images.unsplash.com/photo-1566415601109-ec9fb7e6f397?auto=format&fit=crop&w=800&q=80',
    description: 'Dijital gösterge, ani ısıtma',
    category: 'Isıtma',
  },
  {
    id: '4',
    name: 'Çekiç',
    price: '89.99',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80',
    description: 'Profesyonel kullanım için',
    category: 'Hırdavat',
  },
  {
    id: '5',
    name: 'Pisuar',
    price: '599.99',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Otomatik sensörlü, hijyenik',
    category: 'Su Tesisatı',
  },
  {
    id: '6',
    name: 'Kablo',
    price: '49.99',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?auto=format&fit=crop&w=800&q=80',
    description: 'Yüksek kaliteli, dayanıklı',
    category: 'Elektrik',
  },
  {
    id: '7',
    name: 'Radyatör',
    price: '799.99',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'Yüksek ısı verimi, ekonomik',
    category: 'Isıtma',
  },
  {
    id: '8',
    name: 'Tornavida Seti',
    price: '129.99',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80',
    description: '6 parça, profesyonel set',
    category: 'Hırdavat',
  },
];

export default function ProductsScreen() {
  const { category } = useLocalSearchParams();
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>

      <View style={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>₺{product.price}</Text>
              <TouchableOpacity style={styles.addToCartButton}>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
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