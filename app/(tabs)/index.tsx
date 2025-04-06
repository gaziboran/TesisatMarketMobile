import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Su Tesisatı',
    icon: 'water-outline',
    image: 'https://www.sutesisatfirmasi.com/wp-content/uploads/2023/05/Ucuz-Tesisatci.png',
  },
  {
    id: '2',
    name: 'Elektrik',
    icon: 'flash-outline',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/320571543/VB/DG/PK/21448494/residential-electrical-work-services.jpg',
  },
  {
    id: '3',
    name: 'Isıtma',
    icon: 'thermometer-outline',
    image: 'https://productimages.hepsiburada.net/s/42/550/10728905646130.jpg',
  },
  {
    id: '4',
    name: 'Hırdavat',
    icon: 'hammer-outline',
    image: 'https://productimages.hepsiburada.net/s/37/550/10538725515314.jpg',
  },
];

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

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://www.sutesisatfirmasi.com/wp-content/uploads/2023/05/Ucuz-Tesisatci.png' }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Tesisat Market'e Hoş Geldiniz</Text>
          <Text style={styles.bannerSubtitle}>Kaliteli Ürünler, Uygun Fiyatlar</Text>
        </View>
      </View>

      {/* Kategoriler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
            >
              <Image source={{ uri: category.image }} style={styles.categoryImage} />
              <View style={styles.categoryInfo}>
                <Ionicons name={category.icon as any} size={24} color="#2980b9" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ürünler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
        <View style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
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
    height: 200,
    position: 'relative',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  categoriesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
});
