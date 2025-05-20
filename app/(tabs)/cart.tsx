import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { removeFromCart, getCart, updateCartQuantity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const params = useLocalSearchParams();
  const router = useRouter();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Sepet getirme hatası:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused || params.refresh === 'true') {
      fetchCart();
    }
  }, [isFocused, params.refresh]);

  const handleRemoveFromCart = async (cartId: number) => {
    try {
      await removeFromCart(cartId);
      Alert.alert('Başarılı!', 'Ürün başarıyla sepetten kaldırıldı.');
      fetchCart();
    } catch (error) {
      Alert.alert('Hata', 'Ürün sepetten kaldırılamadı.');
    }
  };

  const handleUpdateQuantity = async (cartId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) return;

    try {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      await updateCartQuantity(cartId, newQuantity);
    } catch (error) {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartId 
            ? { ...item, quantity: currentQuantity }
            : item
        )
      );
      Alert.alert('Hata', 'Miktar güncellenemedi. Lütfen tekrar deneyin.');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2980b9" style={{ flex: 1, marginTop: 50 }} />;
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="log-in-outline" size={64} color="#bdc3c7" />
        <Text style={styles.emptyText}>Giriş Yapmanız Gerekiyor</Text>
        <Text style={styles.emptySubText}>Sepetinizi görüntülemek için giriş yapın</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#bdc3c7" />
        <Text style={styles.emptyText}>Sepetiniz boş</Text>
        <Text style={styles.emptySubText}>Ürün eklemek için alışverişe başlayın</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.itemsContainer}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: `http://localhost:3001${item.product.image}` }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>₺{item.product.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                >
                  <Ionicons name="remove" size={20} color="#2c3e50" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                >
                  <Ionicons name="add" size={20} color="#2c3e50" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFromCart(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Toplam:</Text>
          <Text style={styles.totalPrice}>₺{getTotalPrice().toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push('/address')}
        >
          <Text style={styles.checkoutText}>Siparişi Tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 8,
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    color: '#2c3e50',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  checkoutButton: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 