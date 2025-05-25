import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  roleId: number;
}

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      alert('Hoşgeldiniz!');
        router.push('/');
    } catch (err) {
      alert('Giriş başarısız!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
      router.push('/');
  };

  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) {
      alert('Adres alanı boş bırakılamaz');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Oturum süreniz dolmuş, lütfen tekrar giriş yapın!');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: newAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAddressModalVisible(false);
        alert('Adres başarıyla güncellendi');
      } else {
        throw new Error('Kullanıcı bilgisi alınamadı');
      }
    } catch (error) {
      console.error('Adres güncelleme hatası:', error);
      alert('Adres güncellenemedi, lütfen tekrar deneyin');
    }
  };

  if (isLoading) {
  return (
    <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.welcomeText}>Tesisat Market</Text>
            <Text style={styles.welcomeSubText}>Giriş Yap</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#FF6B00" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#FF6B00" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
          />
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabınız yok mu? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContent}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle-outline" size={80} color="#FF6B00" />
          <Text style={styles.userName}>{user.fullName || user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {user && user.roleId === 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: '#FF6B00',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
              marginTop: 8
            }}
            onPress={() => router.push('/admin')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Admin Paneli</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={24} color="#FF6B00" />
            <Text style={styles.infoText}>{user.phone || '-'}</Text>
              </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="#FF6B00" />
            <Text style={styles.infoText}>{user.address || '-'}</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                setNewAddress(user.address || '');
                setIsAddressModalVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#FF6B00" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Siparişlerim</Text>
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => router.push('/orders')}
          >
            <Text style={styles.orderButtonText}>Siparişlerimi Görüntüle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Tesisat Hizmetleri</Text>
          <TouchableOpacity 
            style={[styles.orderButton, { backgroundColor: '#FF6B00' }]}
            onPress={() => router.push('/plumber-request')}
          >
            <Text style={[styles.orderButtonText, { color: '#fff' }]}>Tesisatçı Çağır</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isAddressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adres Güncelle</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Yeni adresinizi girin"
              value={newAddress}
              onChangeText={setNewAddress}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsAddressModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateAddress}
              >
                <Text style={styles.modalButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileContent: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubText: {
    fontSize: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2c3e50',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#FF6B00',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  orderButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  logoutButtonText: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#FF6B00',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
}); 