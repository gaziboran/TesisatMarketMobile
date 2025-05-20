import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder, getCart } from './services/api';

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

export default function AddressScreen() {
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (error) {
      console.error('Sepet getirme hatası:', error);
    }
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert('Hata', 'Lütfen adresinizi giriniz.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı.');
      return;
    }

    try {
      // Adresi AsyncStorage'a kaydet
      const addressKey = `address_user_${user.id}`;
      await AsyncStorage.setItem(addressKey, address);
      console.log('Adres kaydedildi:', address);

      // Sipariş verilerini hazırla
      const orderData = {
        userId: user.id,
        address: address,
        products: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        totalPrice: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };

      console.log('Sipariş verileri:', orderData);

      const response = await createOrder(orderData);
      console.log('Sipariş oluşturuldu:', response);

      window.alert('Siparişiniz başarıyla oluşturuldu');
      
      // Sepeti temizle ve sepet ekranına yönlendir
      router.replace('/(tabs)/cart');
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      Alert.alert('Hata', 'Sipariş oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teslimat Adresi</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresinizi giriniz"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Siparişi Tamamla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 