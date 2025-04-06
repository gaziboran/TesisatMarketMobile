import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  name: string;
  icon: 'water' | 'flash' | 'hammer' | 'flame';
  color: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

const categories: Category[] = [
  { name: 'Su Tesisatı', icon: 'water', color: '#4A90E2' },
  { name: 'Elektrik', icon: 'flash', color: '#F5A623' },
  { name: 'Hırdavat', icon: 'hammer', color: '#7ED321' },
  { name: 'Isıtma', icon: 'flame', color: '#FF5A5F' },
];

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Musluk Bataryası',
    price: '299.99',
    image: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?auto=format&fit=crop&w=800&q=80',
    description: 'Modern tasarım, uzun ömürlü',
  },
  {
    id: '2',
    name: 'LED Panel',
    price: '159.99',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    description: 'Enerji tasarruflu, parlak ışık',
  },
  {
    id: '3',
    name: 'Elektrikli Şofben',
    price: '899.99',
    image: 'https://images.unsplash.com/photo-1566415601109-ec9fb7e6f397?auto=format&fit=crop&w=800&q=80',
    description: 'Dijital gösterge, ani ısıtma',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80' }}
          style={styles.bannerImage}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Yeni Ürünler</Text>
        </View>
      </View>

      {/* Kategoriler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon} size={28} color={category.color} />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ürünler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
        <View style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productPrice}>₺{product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  bannerContainer: {
    height: 180,
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'column',
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
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  },
});
