import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const emailRegex = /^[\w-\.]+@(gmail\.com|hotmail\.com|outlook\.com)$/i;
  const phoneRegex = /^(05\d{9}|5\d{9})$/;

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Lütfen geçerli bir e-posta adresi girin! (gmail, hotmail, outlook)');
      return;
    }
    if (!phoneRegex.test(phone)) {
      alert('Lütfen geçerli bir telefon numarası girin! (05XXXXXXXXX veya 5XXXXXXXXX)');
      return;
    }
    if (password !== confirmPassword) {
      alert('Şifreler uyuşmuyor!');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          password,
          phone,
          email,
          fullName: name,
          address: "-"
        })
      });
      const data = await response.json();
      if (data.success) {
        // Kayıt başarılı, otomatik giriş yap
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password })
        });
        const loginData = await loginResponse.json();
        if (loginData.token && loginData.user) {
          await AsyncStorage.setItem('user', JSON.stringify(loginData.user));
          await AsyncStorage.setItem('token', loginData.token);
          alert(`Hoşgeldiniz ${loginData.user.fullName}`);
          router.replace('/profile');
        } else {
          alert('Kayıt başarılı! Lütfen giriş yapın.');
          router.push('/profile');
        }
      } else {
        alert(data.message || 'Kayıt başarısız!');
      }
    } catch (err) {
      alert('Sunucuya ulaşılamıyor!');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Tesisat Market</Text>
          <Text style={styles.welcomeSubText}>Kayıt Ol</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              value={name}
              onChangeText={setName}
            />
          </View>

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
            <Ionicons name="call-outline" size={24} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Telefon Numarası"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#FF6B00" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre Tekrar"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Kayıt Ol</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  registerButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 