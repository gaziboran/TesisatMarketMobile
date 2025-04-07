import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

const products: Product[] = [
  // Su Tesisatı Ürünleri
  {
    id: '1',
    name: 'Lavabo Bataryası',
    price: '449.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10566356295730.jpg',
    description: 'Modern tasarım, krom kaplama, seramik valf',
    category: 'Su Tesisatı',
  },
  {
    id: '2',
    name: 'Duş Bataryası',
    price: '599.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10566356295731.jpg',
    description: 'Termostatik, yağmur başlıklı, el duşu dahil',
    category: 'Su Tesisatı',
  },
  {
    id: '3',
    name: 'PPR Boru Seti',
    price: '159.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10566356295732.jpg',
    description: '20mm çap, 10 metre, sıcak su dayanımlı',
    category: 'Su Tesisatı',
  },
  {
    id: '4',
    name: 'Klozet',
    price: '1299.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10566356295733.jpg',
    description: 'Gizli rezervuarlı, yavaş kapanan kapak',
    category: 'Su Tesisatı',
  },

  // Elektrik Ürünleri
  {
    id: '5',
    name: 'LED Panel',
    price: '259.99',
    image: 'https://productimages.hepsiburada.net/s/34/550/10460429672498.jpg',
    description: '24W, Beyaz ışık, Ultra ince',
    category: 'Elektrik',
  },
  {
    id: '6',
    name: 'Priz Kasası',
    price: '89.99',
    image: 'https://productimages.hepsiburada.net/s/31/550/10352096829490.jpg',
    description: 'Topraklı, çocuk korumalı, beyaz',
    category: 'Elektrik',
  },
  {
    id: '7',
    name: 'NYM Kablo',
    price: '449.99',
    image: 'https://productimages.hepsiburada.net/s/31/550/10352096829491.jpg',
    description: '3x2.5mm², 100 metre, TSE belgeli',
    category: 'Elektrik',
  },
  {
    id: '8',
    name: 'Sigorta Kutusu',
    price: '349.99',
    image: 'https://productimages.hepsiburada.net/s/31/550/10352096829492.jpg',
    description: '12 modül, şeffaf kapaklı, sıva üstü',
    category: 'Elektrik',
  },

  // Isıtma Ürünleri
  {
    id: '9',
    name: 'Kombi',
    price: '12999.99',
    image: 'https://productimages.hepsiburada.net/s/42/550/10728905646130.jpg',
    description: '24kW, yoğuşmalı, ErP uyumlu',
    category: 'Isıtma',
  },
  {
    id: '10',
    name: 'Panel Radyatör',
    price: '899.99',
    image: 'https://productimages.hepsiburada.net/s/42/550/10707874234418.jpg',
    description: '600x1200mm, çift panel, beyaz',
    category: 'Isıtma',
  },
  {
    id: '11',
    name: 'Havlupan',
    price: '599.99',
    image: 'https://productimages.hepsiburada.net/s/42/550/10707874234419.jpg',
    description: 'Krom, elektrikli, 500x800mm',
    category: 'Isıtma',
  },
  {
    id: '12',
    name: 'Termostat',
    price: '449.99',
    image: 'https://productimages.hepsiburada.net/s/42/550/10707874234420.jpg',
    description: 'Dijital, programlanabilir, kablosuz',
    category: 'Isıtma',
  },

  // Hırdavat Ürünleri
  {
    id: '13',
    name: 'Matkap Seti',
    price: '799.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10538725515314.jpg',
    description: '24V, şarjlı, çift akü, çantalı',
    category: 'Hırdavat',
  },
  {
    id: '14',
    name: 'El Aletleri Seti',
    price: '449.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10538725515315.jpg',
    description: '115 parça, çantalı, profesyonel',
    category: 'Hırdavat',
  },
  {
    id: '15',
    name: 'Merdiven',
    price: '349.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10538725515316.jpg',
    description: '4+1 basamak, alüminyum, katlanır',
    category: 'Hırdavat',
  },
  {
    id: '16',
    name: 'Kaynak Makinesi',
    price: '1299.99',
    image: 'https://productimages.hepsiburada.net/s/37/550/10538725515317.jpg',
    description: 'İnverter, 200 amper, profesyonel',
    category: 'Hırdavat',
  },
];

export default function ProductsScreen() {
  const { category } = useLocalSearchParams();
  const { addToCart } = useCart();
  const filteredProducts = products.filter(product => product.category === category);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
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