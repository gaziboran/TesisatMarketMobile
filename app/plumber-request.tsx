import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3001/api';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Beklemede', color: '#888' },
  accepted: { label: 'Yönlendirildi', color: '#2980b9' },
  completed: { label: 'Halloldu', color: '#27ae60' },
  cancelled: { label: 'İptal', color: '#e74c3c' },
};

export default function PlumberRequestScreen() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [requests, setRequests] = useState<Array<{ id: number; status: string; createdAt: string; address: string; problemDescription: string }>>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState<Record<number, boolean>>({});

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

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  useEffect(() => {
    // Yorum ve puanları ilk yüklemede doldur
    if (requests.length > 0) {
      const initialRatings: Record<number, number> = {};
      const initialComments: Record<number, string> = {};
      requests.forEach((req: any) => {
        if (req.rating) initialRatings[req.id] = req.rating;
        if (req.comment) initialComments[req.id] = req.comment;
      });
      setRatings(initialRatings);
      setComments(initialComments);
    }
  }, [requests]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/plumber-requests/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      } else {
        throw new Error(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Talepler yüklenirken hata:', error);
    }
  };

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

  const handleRate = (requestId: number, rating: number) => {
    setRatings({ ...ratings, [requestId]: rating });
  };

  const handleComment = (requestId: number, comment: string) => {
    setComments({ ...comments, [requestId]: comment });
  };

  const handleSubmitRatingAndComment = async (requestId: number) => {
    try {
      const response = await fetch(`${API_URL}/plumber-requests/${requestId}/rating-comment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: ratings[requestId],
          comment: comments[requestId],
        }),
      });
      if (response.ok) {
        setSubmitSuccess((prev) => ({ ...prev, [requestId]: true }));
        // Yorum ve puan güncellendiğinde state'i de güncelle
        setRatings((prev) => ({ ...prev, [requestId]: ratings[requestId] }));
        setComments((prev) => ({ ...prev, [requestId]: comments[requestId] }));
      } else {
        throw new Error('Gönderilemedi');
      }
    } catch (error) {
      alert('Puan ve yorum gönderilirken hata oluştu.');
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

      <View style={styles.requestsList}>
        <Text style={{fontSize:24,fontWeight:'bold',marginBottom:24,color:'#2c3e50'}}>Geçmiş Talepler</Text>
        {requests.map((request) => (
          <View key={request.id} style={styles.requestItem}>
            <View style={styles.requestHeader}>
              <Text style={{fontSize:18,fontWeight:'bold',color:'#2c3e50'}}>Talep #{request.id}</Text>
              <Text style={{fontSize:16, color: statusMap[request.status]?.color || '#7f8c8d'}}>
                Durum: {statusMap[request.status]?.label || request.status}
              </Text>
            </View>
            <Text style={{fontSize:14,color:'#7f8c8d',marginTop:8}}>Tarih: {new Date(request.createdAt).toLocaleDateString()}</Text>
            <Text style={{fontSize:16,color:'#2c3e50',marginTop:8}}>Adres: {request.address}</Text>
            <Text style={{fontSize:16,color:'#2c3e50',marginTop:8}}>Tesisat Sorunu: {request.problemDescription}</Text>
            {request.status === 'completed' ? (
              <>
                <View style={styles.ratingContainer}>
                  <Text style={{fontSize:16,fontWeight:'bold',color:'#2c3e50'}}>Puan: {ratings[request.id] || 'Henüz puanlanmadı'}</Text>
                  <View style={styles.ratingButtons}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <TouchableOpacity key={rating} onPress={() => handleRate(request.id, rating)}>
                        <Text style={[styles.ratingButton, { color: rating <= (ratings[request.id] || 0) ? '#FFD700' : '#e0e0e0' }]}>
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.commentContainer}>
                  <Text style={{fontSize:16,fontWeight:'bold',color:'#2c3e50'}}>Yorum:</Text>
                  <TextInput
                    style={styles.commentInput}
                    value={comments[request.id] || ''}
                    onChangeText={(text) => handleComment(request.id, text)}
                    placeholder="Tesisatçı hakkında yorumunuzu yazın..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
                {submitSuccess[request.id] ? (
                  <View style={styles.successBox}>
                    <Text style={{color:'#27ae60',fontWeight:'bold',fontSize:16}}>Puan ve yorum başarıyla gönderildi!</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => handleSubmitRatingAndComment(request.id)}
                  >
                    <Text style={styles.sendButtonText}>Gönder</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={{marginTop:12,color:'#888'}}>Yorum ve puan verebilmek için talebin tamamlanmasını bekleyin.</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  requestsList: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingButtons: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 8,
  },
  ratingButton: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  commentContainer: {
    marginTop: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successBox: {
    backgroundColor: '#eafbe7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
}); 