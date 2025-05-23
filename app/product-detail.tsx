import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './contexts/CartContext';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Comment {
  id: string;
  userId: string;
  productId: string;
  comment: string;
  timestamp: string;
  userName: string;
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
  const { user, isLoading: authLoading } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      fetchProduct();
      fetchComments();
    }
  }, [id, authLoading]);

  useEffect(() => {
    setNewComment('');
    setShowCommentInput(false);
    setCommentLoading(false);
  }, [user]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments?productId=${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    }
  };

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

  const handleAddComment = async () => {
    // Her yorumda en güncel kullanıcıyı AsyncStorage'dan çek
    let currentUser = user;
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    } catch (e) {
      // ignore
    }
    if (!currentUser) {
      console.log('Yorum yapabilmek için giriş yapmalısınız');
      return;
    }
    if (!newComment.trim()) {
      console.log('Lütfen bir yorum yazın');
      return;
    }
    setCommentLoading(true);
    try {
      await api.post('/comments', {
        userId: currentUser.id,
        productId: id,
        comment: newComment,
        timestamp: new Date().toISOString(),
        userName: currentUser.username
      });
      setNewComment('');
      setShowCommentInput(false);
      fetchComments();
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLogin = () => {
    Alert.alert(
      "Giriş Gerekli",
      "Yorum yapabilmek için giriş yapmalısınız.",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Giriş Yap",
          onPress: () => {
            router.back();
          }
        }
      ]
    );
  };

  if (loading || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

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
            {user ? (
            <TouchableOpacity 
              style={styles.addReviewButton}
              onPress={() => setShowCommentInput(true)}
            >
              <Text style={styles.addReviewText}>Yorum Yap</Text>
            </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              </TouchableOpacity>
            )}
          </View>

          {showCommentInput && user && (
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
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.commentButton, styles.submitButton]}
                  onPress={handleAddComment}
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Gönder</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.commentsList}>
            {comments.filter(c => !c.comment.startsWith('[ADMIN]')).map((comment) => {
              // Admin cevabı var mı kontrolü
              const adminReply = comments.find(r => r.productId === comment.productId && r.comment.startsWith('[ADMIN]') && r.timestamp > comment.timestamp);
              return (
                <View key={comment.id} style={{backgroundColor:'#f8f9fa',padding:15,borderRadius:10,marginBottom:18,shadowColor:'#ff9800',shadowOpacity:adminReply?0.15:0,shadowRadius:adminReply?6:0,borderWidth:adminReply?1:0,borderColor:adminReply?'#ff9800':'#f8f9fa'}}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUserHighlight}>{comment.userName}</Text>
                    <Text style={styles.commentDate}>{new Date(comment.timestamp).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                  {/* Admin cevabı kutusu */}
                  {adminReply && (
                    <View style={{backgroundColor:'#fff3e0',borderColor:'#ff9800',borderWidth:1,marginTop:14,padding:10,borderRadius:8,marginLeft:8}}>
                      <Text style={{fontWeight:'bold',color:'#e67e22',marginBottom:2}}>Admin Cevabı</Text>
                      <Text style={{fontSize:14,color:'#b26a00'}}>{adminReply.comment.replace('[ADMIN]','').trim()}</Text>
                      <Text style={{fontSize:11,color:'#b26a00',marginTop:2}}>{new Date(adminReply.timestamp).toLocaleDateString('tr-TR')}</Text>
                    </View>
                  )}
                </View>
              );
            })}
            {comments.filter(c => !c.comment.startsWith('[ADMIN]')).length === 0 && (
              <Text style={styles.noComments}>Henüz yorum yapılmamış</Text>
            )}
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
  loginButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  commentInputContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  commentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  submitButton: {
    backgroundColor: '#2980b9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  commentsList: {
    marginTop: 15,
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  commentUserHighlight: {
    fontWeight: 'bold',
    color: '#1565c0',
    fontSize: 16,
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  commentDate: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  commentText: {
    color: '#34495e',
    lineHeight: 20,
  },
  noComments: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 