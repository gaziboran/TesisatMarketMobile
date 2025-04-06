import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './contexts/CartContext';

export default function ProductDetailScreen() {
  const { id, name, price, image, description, category } = useLocalSearchParams();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: id as string,
      name: name as string,
      price: price as string,
      image: image as string,
      category: category as string,
    });

    Alert.alert(
      "Başarılı!",
      "Ürün sepetinize eklendi.",
      [
        {
          text: "Alışverişe Devam Et",
          onPress: () => router.back(),
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
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
      </TouchableOpacity>

      {/* Ürün Görseli */}
      <Image source={{ uri: image as string }} style={styles.productImage} resizeMode="cover" />

      {/* Ürün Bilgileri */}
      <View style={styles.productInfo}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>₺{price}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2980b9" />
              <Text style={styles.featureText}>Orijinal Ürün</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#2980b9" />
              <Text style={styles.featureText}>2 Yıl Garanti</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="car-outline" size={24} color="#2980b9" />
              <Text style={styles.featureText}>Ücretsiz Kargo</Text>
            </View>
          </View>
        </View>

        {/* Sepete Ekle Butonu */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
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
    height: 300,
  },
  productInfo: {
    padding: 16,
  },
  category: {
    fontSize: 14,
    color: '#2980b9',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 24,
  },
  features: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 