import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Animated, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { getCategories } from '../services/api';

interface Category {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  slug?: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories();
        console.log('Kategoriler başarıyla alındı:', data);
        setCategories(data);
      } catch (err) {
        console.error('Kategori çekme hatası:', err);
        setError('Kategoriler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const bannerScale = scrollY.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [1.2, 1, 0.8],
  });

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.5],
  });

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Musluk Bataryası',
    price: '799.99',
    image: 'https://productimages.hepsiburada.net/s/86/375-375/110000028946068.jpg',
    description: 'Krom kaplama, seramik valf',
    category: 'Su Tesisatı',
  },
  {
    id: '2',
    name: 'Sıva Altı LED Panel',
    price: '259.99',
    image: 'https://static.ticimax.cloud/41865/uploads/urunresimleri/buyuk/nisaluce-6w-siva-alti-led-panel-6500k-409e1-.jpg',
    description: '24W, Beyaz ışık, Ultra ince',
    category: 'Elektrik',
  },
  {
    id: '3',
    name: 'Dijital Şofben',
    price: '2299.99',
    image: 'https://cdn03.ciceksepeti.com/cicek/kcm62236045-1/L/akilli-dijital-sicaklik-ayarli-sofben-sh-3p-siyah-klasik-sh-3p-kcm62236045-1-d2f0694859c2449baa20d6031871dc64.jpg',
    description: 'LCD ekran, Akıllı ısı kontrolü',
    category: 'Isıtma',
  },
];

  const renderCategory = ({ item, index }: { item: Category; index: number }) => (
    <Animated.View
      style={[
        styles.categoryCard,
        {
          transform: [{
            translateX: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50 * (index + 1), 0],
            })
          }]
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push({
          pathname: '/products',
          params: { category: item.name }
        })}
      >
        <Image 
          source={{ 
            uri: `http://localhost:3001${item.image}`
          }} 
          style={styles.categoryImage} 
        />
        <View style={styles.categoryInfo}>
          {item.icon ? (
            <Ionicons name={item.icon as any} size={24} color="#FF6B00" />
          ) : null}
          <Text style={styles.categoryText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2980b9" style={{ flex: 1, marginTop: 50 }} />;
  }

  if (error) {
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</Text>;
  }

  return (
    <Animated.ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      {/* Banner */}
      <Animated.View style={[
        styles.bannerContainer,
        {
          transform: [{ scale: bannerScale }],
          opacity: bannerOpacity,
        }
      ]}>
        <Image
          source={{ uri: 'https://www.sutesisatfirmasi.com/wp-content/uploads/2023/05/Ucuz-Tesisatci.png' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Tesisat Market'e Hoş Geldiniz</Text>
          <Text style={styles.bannerSubtitle}>Kaliteli Ürünler, Uygun Fiyatlar</Text>
        </View>
      </Animated.View>

      {/* Kategoriler */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </Animated.View>

      {/* Ürünler */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
        <View style={styles.productsGrid}>
          {featuredProducts.map((product, index) => (
            <Animated.View
              key={product.id}
              style={[
                styles.productCard,
                {
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 * (index + 1), 0],
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity
              onPress={() => router.push({
                pathname: '/product-detail',
                params: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  description: product.description,
                  category: product.category,
                },
              })}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productPrice}>₺{product.price}</Text>
              </View>
            </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
    marginBottom: 20,
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
    backgroundColor: 'rgba(255, 107, 0, 0.8)',
    padding: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  section: {
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    marginTop: 30,
  },
  categoriesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginTop: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#FF6B00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  categoryImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  categoryInfo: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 8,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'column',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#FF6B00',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ scale: 1 }],
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
    color: '#FF6B00',
  },
});
