import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder } from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartScreen() {
  const { cartItems, setCartItems } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Test için adres bilgisini ayarla
  useEffect(() => {
    const setTestAddress = async () => {
      await AsyncStorage.setItem('address', 'Test Adres, Test Mahallesi, Test Sokak No:1');
    };
    setTestAddress();
  }, []);

  const handleCompleteOrder = async () => {
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
      return;
    }

    try {
      setLoading(true);

      const address = await AsyncStorage.getItem('address');
      if (!address || address.trim() === '') {
        Alert.alert('Adres Gerekli', 'Sipariş verebilmek için önce adres girmeniz gerekiyor.');
        return;
      }

      for (const item of cartItems) {
        const orderData = {
          userId: user.id,
          productId: item.product.id,
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          address: address,
        };

        await createOrder(orderData);
      }

      Alert.alert('Sipariş Onayı', 'Siparişiniz başarıyla onaylandı!');
      setCartItems([]);
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      Alert.alert('Hata', 'Sipariş sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0);

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Sepetiniz boş</Text>
      ) : (
        <>
          {cartItems.map((item: CartItem) => (
            <View key={item.product.id} style={styles.cartItem}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.quantity}>Adet: {item.quantity}</Text>
              <Text style={styles.price}>{item.product.price * item.quantity} TL</Text>
            </View>
          ))}
          <View style={styles.footer}>
            <Text style={styles.totalText}>Toplam: {total.toFixed(2)} TL</Text>
            <TouchableOpacity 
              style={[styles.checkoutButton, loading && styles.disabledButton]} 
              onPress={handleCompleteOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.checkoutButtonText}>Siparişi Tamamla</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cartItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2ecc71',
    marginTop: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  checkoutButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 