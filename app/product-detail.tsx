import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './contexts/CartContext';
import { useState } from 'react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Örnek yorumlar - Gerçek uygulamada API'den gelecek
const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'Ahmet Y.',
    rating: 5,
    comment: 'Çok kaliteli bir ürün, kesinlikle tavsiye ederim.',
    date: '2024-03-15'
  },
  {
    id: '2',
    userName: 'Mehmet K.',
    rating: 4,
    comment: 'Fiyat/performans ürünü, memnun kaldım.',
    date: '2024-03-14'
  },
  {
    id: '3',
    userName: 'Ayşe S.',
    rating: 5,
    comment: 'Hızlı kargo ve güzel paketleme. Ürün beklediğim gibi çıktı.',
    date: '2024-03-13'
  }
];

export default function ProductDetailScreen() {
  const { id, name, price, image, description, category } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color="#f1c40f"
        style={{ marginRight: 2 }}
      />
    ));
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Burada yorum API'ye gönderilecek
      Alert.alert("Başarılı", "Yorumunuz gönderildi ve incelendikten sonra yayınlanacaktır.");
      setNewComment('');
      setShowCommentInput(false);
    }
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

        {/* Yorumlar Bölümü */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Müşteri Yorumları</Text>
            <TouchableOpacity 
              style={styles.addReviewButton}
              onPress={() => setShowCommentInput(true)}
            >
              <Text style={styles.addReviewText}>Yorum Yap</Text>
            </TouchableOpacity>
          </View>

          {showCommentInput && (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <View style={styles.commentButtons}>
                <TouchableOpacity 
                  style={[styles.commentButton, styles.cancelButton]}
                  onPress={() => {
                    setShowCommentInput(false);
                    setNewComment('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.commentButton, styles.submitButton]}
                  onPress={handleAddComment}
                >
                  <Text style={styles.submitButtonText}>Gönder</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {sampleReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{review.userName}</Text>
                <View style={styles.ratingContainer}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          ))}
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
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    backgroundColor: '#2980b9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addReviewText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  commentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e9ecef',
  },
  submitButton: {
    backgroundColor: '#2980b9',
  },
  cancelButtonText: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
}); 