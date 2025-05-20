import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createOrder } from '../services/api';

export default function AddressForm() {
  const [address, setAddress] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
    if (!address.trim()) {
            Alert.alert('Hata', 'Lütfen adres bilgilerinizi giriniz');
      return;
    }

    try {
            // Adresi kaydet
            await AsyncStorage.setItem('address', address);

            // Siparişi oluştur
            const cartItems = await AsyncStorage.getItem('cart');
            if (!cartItems) {
                Alert.alert('Hata', 'Sepetiniz boş');
        return;
      }

            const items = JSON.parse(cartItems);
            const userId = await AsyncStorage.getItem('userId');

            // Her ürün için sipariş oluştur
            for (const item of items) {
                await createOrder({
                    userId: Number(userId),
                    productId: item.product.id,
                    quantity: item.quantity,
                    totalPrice: item.product.price * item.quantity,
                    address
                });
            }

            // Başarılı sipariş sayfasına yönlendir
        router.push('/order-success');
      } catch (error) {
            console.error('Sipariş hatası:', error);
            Alert.alert('Hata', 'Sipariş oluşturulurken bir hata oluştu');
    }
  };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Teslimat Adresi</Text>
          <TextInput
            style={styles.input}
                placeholder="Adres bilgilerinizi giriniz"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={4}
          />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Kaydet ve Siparişi Tamamla</Text>
            </TouchableOpacity>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
        backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
  },
  input: {
    borderWidth: 1,
        borderColor: '#ddd',
    borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    minHeight: 100,
        textAlignVertical: 'top'
  },
  button: {
        backgroundColor: '#007AFF',
        padding: 15,
    borderRadius: 8,
        alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
        fontWeight: 'bold'
    }
}); 