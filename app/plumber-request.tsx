import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlumberRequestScreen() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const tokenData = await AsyncStorage.getItem('token');
        if (userData && tokenData) {
          setUser(JSON.parse(userData));
          setToken(tokenData);
          setAddress(JSON.parse(userData).address || '');
          setPhone(JSON.parse(userData).phone || '');
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      }
    };
    loadUserData();
  }, []);

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!address || !phone || !problem) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('address', address);
      formData.append('phoneNumber', phone);
      formData.append('problemDescription', problem);
      formData.append('status', 'pending');
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      const response = await fetch('http://localhost:3001/api/plumber-requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData as any,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Tesisatçı talebi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Tesisatçı Çağır</Text>
      </View>

      {success ? (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:60}}>
          <Text style={{fontSize:22,fontWeight:'bold',color:'#27ae60',marginBottom:16}}>Talebiniz başarıyla iletildi!</Text>
          <Text style={{fontSize:16,marginBottom:32}}>En kısa sürede sizinle iletişime geçilecektir.</Text>
          <TouchableOpacity style={[styles.submitButton,{backgroundColor:'#2c3e50'}]} onPress={()=>router.back()}>
            <Text style={styles.submitButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adres</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Adresinizi girin"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefon Numarası</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Telefon numaranızı girin"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tesisat Sorunu</Text>
            <TextInput
              style={[styles.input, styles.problemInput]}
              value={problem}
              onChangeText={setProblem}
              placeholder="Tesisat sorununuzu detaylı bir şekilde açıklayın"
              multiline
              numberOfLines={5}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fotoğraf (isteğe bağlı)</Text>
            <input
              type="file"
              accept="image/*"
              onChange={handlePickImage}
              style={{ marginBottom: 8 }}
            />
            {selectedImage && <Text>{selectedImage.name}</Text>}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Tesisatçı Çağır</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  problemInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 