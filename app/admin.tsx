import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView as RNScrollView } from 'react-native';

const API_URL = 'http://localhost:3001/api';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'users' | 'plumber' | 'orders' | 'comments' | 'categories' | 'products'>('categories');
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '', icon: '' });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [plumberRequests, setPlumberRequests] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [replyingCommentId, setReplyingCommentId] = useState<number|null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number|null>(null);
  const [editingReplyText, setEditingReplyText] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', image: '', categoryId: '' });
  const categoryFileInput = useRef<HTMLInputElement | null>(null);
  const productFileInput = useRef<HTMLInputElement | null>(null);
  const [categoryImageUploading, setCategoryImageUploading] = useState(false);
  const [productImageUploading, setProductImageUploading] = useState(false);
  const [categoryImageFileName, setCategoryImageFileName] = useState('');
  const [productImageFileName, setProductImageFileName] = useState('');

  useEffect(() => {
    if (!user || user.roleId !== 0) {
      router.replace('/');
    } else {
      if (tab === 'categories') fetchCategories();
      if (tab === 'users') fetchUsers();
      if (tab === 'plumber') fetchPlumberRequests();
      if (tab === 'orders') fetchOrders();
      if (tab === 'comments') fetchComments();
      if (tab === 'products') fetchProducts();
    }
  }, [user, tab]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      Alert.alert('Hata', 'Kategoriler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      Alert.alert('Hata', 'Kullanıcılar alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlumberRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/plumber-requests/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPlumberRequests(data);
    } catch (e) {
      Alert.alert('Hata', 'Tesisat talepleri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (e) {
      Alert.alert('Hata', 'Siparişler alınamadı');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert('Hata', 'Yorumlar alınamadı');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert('Hata', 'Ürünler alınamadı');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlumberStatus = async (id: string, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/plumber-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPlumberRequests();
      else Alert.alert('Hata', 'Durum güncellenemedi');
    } catch (e) {
      Alert.alert('Hata', 'Durum güncellenemedi');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return Alert.alert('Hata', 'Kategori adı zorunlu');
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      if (res.ok) {
        setNewCategory({ name: '', description: '', image: '', icon: '' });
        fetchCategories();
      } else {
        Alert.alert('Hata', 'Kategori eklenemedi');
      }
    } catch (e) {
      Alert.alert('Hata', 'Kategori eklenemedi');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      } else {
        Alert.alert('Hata', 'Kategori silinemedi');
      }
    } catch (e) {
      Alert.alert('Hata', 'Kategori silinemedi');
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
      else Alert.alert('Hata', 'Sipariş durumu güncellenemedi');
    } catch (e) {
      Alert.alert('Hata', 'Sipariş durumu güncellenemedi');
    }
  };

  const handleAdminReply = async (comment: any) => {
    if (!adminReply.trim()) return;
    const adminUser = user;
    if (!adminUser) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: adminUser.id,
          productId: comment.productId,
          comment: `[ADMIN] ${adminReply}`,
          timestamp: new Date().toISOString()
        })
      });
      setAdminReply('');
      setReplyingCommentId(null);
      fetchComments();
    } catch (e) {
      Alert.alert('Hata', 'Cevap eklenemedi');
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchComments();
    } catch (e) {
      Alert.alert('Hata', 'Yorum silinemedi');
    }
  };

  const handleEditComment = (reply: any) => {
    setEditingReplyId(reply.id);
    setEditingReplyText(reply.comment.replace('[ADMIN]','').trim());
  };

  const handleUpdateComment = async (reply: any) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/comments/${reply.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ comment: `[ADMIN] ${editingReplyText}` })
      });
      setEditingReplyId(null);
      setEditingReplyText('');
      fetchComments();
    } catch (e) {
      Alert.alert('Hata', 'Yorum güncellenemedi');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) return Alert.alert('Hata', 'Zorunlu alanlar eksik');
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock) || 0,
          categoryId: Number(newProduct.categoryId)
        })
      });
      if (res.ok) {
        setNewProduct({ name: '', description: '', price: '', stock: '', image: '', categoryId: '' });
        fetchProducts();
      } else {
        Alert.alert('Hata', 'Ürün eklenemedi');
      }
    } catch (e) {
      Alert.alert('Hata', 'Ürün eklenemedi');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
      else Alert.alert('Hata', 'Ürün silinemedi');
    } catch (e) {
      Alert.alert('Hata', 'Ürün silinemedi');
    }
  };

  const orderStatusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Beklemede', color: '#888' },
    accepted: { label: 'Onaylandı', color: '#2980b9' },
    completed: { label: 'Tamamlandı', color: '#27ae60' },
    cancelled: { label: 'İptal', color: '#e74c3c' },
  };

  // Kategori fotoğrafı yükle
  const handleCategoryImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setCategoryImageUploading(true);
    setCategoryImageFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_URL}/categories/upload-image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imagePath) {
        setNewCategory((prev) => ({ ...prev, image: data.imagePath }));
      } else {
        Alert.alert('Hata', 'Fotoğraf yüklenemedi');
      }
    } catch (err) {
      Alert.alert('Hata', 'Fotoğraf yüklenemedi');
    } finally {
      setCategoryImageUploading(false);
    }
  };

  // Ürün fotoğrafı yükle
  const handleProductImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setProductImageUploading(true);
    setProductImageFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_URL}/products/upload-image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imagePath) {
        setNewProduct((prev) => ({ ...prev, image: data.imagePath }));
      } else {
        Alert.alert('Hata', 'Fotoğraf yüklenemedi');
      }
    } catch (err) {
      Alert.alert('Hata', 'Fotoğraf yüklenemedi');
    } finally {
      setProductImageUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <Text style={styles.title}>Admin Paneli</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={async () => { await logout(); router.replace('/(tabs)'); }}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabBar}>
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} style={{overflowX:'auto',marginBottom:16}} contentContainerStyle={{flexDirection:'row',gap:8}}>
          <TouchableOpacity onPress={() => setTab('users')} style={[styles.tab, tab === 'users' && styles.activeTab]}><Text style={styles.tabText}>Kullanıcılar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('plumber')} style={[styles.tab, tab === 'plumber' && styles.activeTab]}><Text style={styles.tabText}>Tesisat Talepleri</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('orders')} style={[styles.tab, tab === 'orders' && styles.activeTab]}><Text style={styles.tabText}>Siparişler</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('comments')} style={[styles.tab, tab === 'comments' && styles.activeTab]}><Text style={styles.tabText}>Yorumlar</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('products')} style={[styles.tab, tab === 'products' && styles.activeTab]}><Text style={styles.tabText}>Ürünler</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('categories')} style={[styles.tab, tab === 'categories' && styles.activeTab]}><Text style={styles.tabText}>Kategoriler</Text></TouchableOpacity>
        </RNScrollView>
      </View>
      <View style={styles.content}>
        {tab === 'categories' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Kategoriler</Text>
            {loading ? <Text>Yükleniyor...</Text> : categories.map(cat => (
              <View key={cat.id} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <Text>{cat.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteCategory(cat.id)} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}>
                  <Text style={{color:'#fff'}}>Sil</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={{marginTop:24}}>
              <Text style={{fontWeight:'bold',marginBottom:8}}>Yeni Kategori Ekle</Text>
              <TextInput placeholder="Kategori Adı" value={newCategory.name} onChangeText={t=>setNewCategory({...newCategory,name:t})} style={styles.input} />
              <TextInput placeholder="Açıklama" value={newCategory.description} onChangeText={t=>setNewCategory({...newCategory,description:t})} style={styles.input} />
              {Platform.OS === 'web' && (
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { categoryFileInput.current = el; }}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target) {
                        handleCategoryImageUpload(e);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={{backgroundColor:'#2980b9',padding:8,borderRadius:6,marginRight:8}}
                    onPress={() => (categoryFileInput.current as HTMLInputElement)?.click()}
                    disabled={categoryImageUploading}
                  >
                    <Text style={{color:'#fff'}}>{categoryImageUploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</Text>
                  </TouchableOpacity>
                  <Text style={{fontSize:12,color:'#888'}}>{categoryImageFileName || (newCategory.image && 'Yüklendi')}</Text>
                </View>
              )}
              <TextInput placeholder="İkon" value={newCategory.icon} onChangeText={t=>setNewCategory({...newCategory,icon:t})} style={styles.input} />
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {tab === 'users' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Kullanıcılar</Text>
            {loading ? <Text>Yükleniyor...</Text> : users.map(u => (
              <View key={u.id} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8,backgroundColor:'#f8f9fa',padding:8,borderRadius:8}}>
                <View>
                  <Text style={{fontWeight:'bold'}}>{u.username} {u.roleId === 0 && <Text style={{color:'#e67e22'}}>(Admin)</Text>}</Text>
                  <Text style={{fontSize:12}}>{u.email}</Text>
                  <Text style={{fontSize:12}}>Tel: {u.phone || '-'}</Text>
                  <Text style={{fontSize:12}}>Adres: {u.address || '-'}</Text>
                </View>
                {/* <TouchableOpacity style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Sil</Text></TouchableOpacity> */}
              </View>
            ))}
          </View>
        )}
        {tab === 'plumber' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Tesisatçı Talepleri</Text>
            {loading ? <Text>Yükleniyor...</Text> : plumberRequests.map(req => (
              <View key={req.id} style={{backgroundColor:'#f8f9fa',padding:10,borderRadius:8,marginBottom:10}}>
                <Text style={{fontWeight:'bold'}}>{req.problemDescription}</Text>
                <Text style={{fontSize:12}}>Adres: {req.address}</Text>
                <Text style={{fontSize:12}}>Telefon: {req.phoneNumber}</Text>
                <Text style={{fontSize:12}}>Durum: {req.status}</Text>
                <View style={{flexDirection:'row',marginTop:8,gap:8}}>
                  <TouchableOpacity onPress={()=>handleUpdatePlumberStatus(req.id,'accepted')} style={{backgroundColor:'#2980b9',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Yönlendirildi</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>handleUpdatePlumberStatus(req.id,'completed')} style={{backgroundColor:'#27ae60',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Halloldu</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>handleUpdatePlumberStatus(req.id,'cancelled')} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>İptal</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        {tab === 'orders' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Siparişler</Text>
            {loading ? <Text>Yükleniyor...</Text> : (Array.isArray(orders) && orders.length > 0 ? orders.map(order => (
              <View key={order.id} style={{backgroundColor:'#f8f9fa',padding:10,borderRadius:8,marginBottom:10}}>
                <Text style={{fontWeight:'bold'}}>Sipariş #{order.id}</Text>
                <Text style={{fontSize:12}}>Kullanıcı ID: {order.userId}</Text>
                <Text style={{fontSize:12}}>Adres: {order.address}</Text>
                <Text style={{fontSize:12}}>Tarih: {new Date(order.createdAt).toLocaleDateString('tr-TR')}</Text>
                <Text style={{fontSize:12}}>Durum: <Text style={{color: orderStatusMap[order.status]?.color || '#7f8c8d'}}>{orderStatusMap[order.status]?.label || order.status}</Text></Text>
                <Text style={{fontSize:12,marginTop:4}}>Ürünler:</Text>
                {order.items && order.items.map((item: any) => (
                  <Text key={item.id} style={{fontSize:12,marginLeft:8}}>- {item.product?.name || 'Ürün'} x{item.quantity} (₺{item.price})</Text>
                ))}
                <Text style={{fontSize:12,marginTop:4}}>Toplam: ₺{order.total}</Text>
                <View style={{flexDirection:'row',marginTop:8,gap:8}}>
                  <TouchableOpacity onPress={()=>handleUpdateOrderStatus(order.id,'accepted')} style={{backgroundColor:'#2980b9',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Onaylandı</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>handleUpdateOrderStatus(order.id,'completed')} style={{backgroundColor:'#27ae60',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Tamamlandı</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>handleUpdateOrderStatus(order.id,'cancelled')} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>İptal</Text></TouchableOpacity>
                </View>
              </View>
            )) : <Text>Hiç sipariş yok.</Text>)}
          </View>
        )}
        {tab === 'comments' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Tüm Yorumlar</Text>
            {loading ? <Text>Yükleniyor...</Text> : (Array.isArray(comments) && comments.length > 0 ? comments.map(comment => {
              // Admin cevabı var mı kontrolü
              const adminReply = Array.isArray(comments) && comments.find(r => r.productId === comment.productId && r.comment.startsWith('[ADMIN]') && r.timestamp > comment.timestamp);
              if (comment.comment.startsWith('[ADMIN]')) return null; // Admin cevabını ana listede gösterme
              return (
                <View key={comment.id} style={{backgroundColor:'#f8f9fa',padding:10,borderRadius:8,marginBottom:18}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{fontWeight:'bold',color:'#2c3e50',backgroundColor:'#eaf1fb',paddingHorizontal:8,paddingVertical:2,borderRadius:6}}>{comment.user?.username || 'Kullanıcı Yok'}</Text>
                    <Text style={{fontSize:12,color:'#888'}}>{new Date(comment.timestamp).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <Text style={{fontSize:12,color:'#888',marginTop:2}}>Ürün: {comment.product?.name || '-'}</Text>
                  <Text style={{fontSize:14,marginTop:6}}>{comment.comment}</Text>
                  {/* Admin cevabı kutusu */}
                  {adminReply && (
                    <View style={{backgroundColor:'#fff3e0',borderColor:'#ff9800',borderWidth:1,marginTop:14,padding:10,borderRadius:8,marginLeft:8}}>
                      <Text style={{fontWeight:'bold',color:'#e67e22',marginBottom:2}}>Admin Cevabı</Text>
                      {editingReplyId === adminReply.id ? (
                        <View>
                          <TextInput
                            value={editingReplyText}
                            onChangeText={setEditingReplyText}
                            style={{borderWidth:1,borderColor:'#ddd',borderRadius:6,padding:8,backgroundColor:'#fff',marginBottom:6}}
                            multiline
                          />
                          <View style={{flexDirection:'row',gap:8}}>
                            <TouchableOpacity onPress={()=>handleUpdateComment(adminReply)} style={{backgroundColor:'#27ae60',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Kaydet</Text></TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setEditingReplyId(null);setEditingReplyText('');}} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>İptal</Text></TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text style={{fontSize:14,color:'#b26a00'}}>{adminReply.comment.replace('[ADMIN]','').trim()}</Text>
                          <Text style={{fontSize:11,color:'#b26a00',marginTop:2}}>{new Date(adminReply.timestamp).toLocaleDateString('tr-TR')}</Text>
                          <View style={{flexDirection:'row',gap:8,marginTop:6}}>
                            <TouchableOpacity onPress={()=>handleEditComment(adminReply)} style={{backgroundColor:'#2980b9',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Düzenle</Text></TouchableOpacity>
                            <TouchableOpacity onPress={()=>handleDeleteComment(adminReply.id)} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6}}><Text style={{color:'#fff'}}>Sil</Text></TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                  {/* Cevapla butonu ve alanı */}
                  {replyingCommentId === comment.id ? (
                    <View style={{marginTop:8}}>
                      <TextInput
                        value={adminReply}
                        onChangeText={setAdminReply}
                        placeholder="Cevabınızı yazın..."
                        style={{borderWidth:1,borderColor:'#ddd',borderRadius:6,padding:8,backgroundColor:'#fff'}}
                        multiline
                      />
                      <View style={{flexDirection:'row',gap:8,marginTop:4}}>
                        <TouchableOpacity onPress={()=>handleAdminReply(comment)} style={{backgroundColor:'#27ae60',padding:8,borderRadius:6}}><Text style={{color:'#fff'}}>Gönder</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setReplyingCommentId(null);setAdminReply('');}} style={{backgroundColor:'#e74c3c',padding:8,borderRadius:6}}><Text style={{color:'#fff'}}>İptal</Text></TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={()=>{setReplyingCommentId(comment.id);setAdminReply('');}} style={{marginTop:8,backgroundColor:'#2980b9',padding:6,borderRadius:6,alignSelf:'flex-start'}}>
                      <Text style={{color:'#fff'}}>Cevapla</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }) : <Text>Hiç yorum yok.</Text>)}
          </View>
        )}
        {tab === 'products' && (
          <View>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Ürünler</Text>
            {loading ? <Text>Yükleniyor...</Text> : products.map(prod => (
              <View key={prod.id} style={{backgroundColor:'#f8f9fa',padding:10,borderRadius:8,marginBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:'bold'}}>{prod.name}</Text>
                  <Text style={{fontSize:12,color:'#888'}}>Kategori: {prod.category?.name || '-'}</Text>
                  <Text style={{fontSize:12}}>Fiyat: ₺{prod.price}</Text>
                  <Text style={{fontSize:12}}>Stok: {prod.stock}</Text>
                </View>
                <TouchableOpacity onPress={()=>handleDeleteProduct(prod.id)} style={{backgroundColor:'#e74c3c',padding:6,borderRadius:6,marginLeft:8}}><Text style={{color:'#fff'}}>Sil</Text></TouchableOpacity>
              </View>
            ))}
            <View style={{marginTop:24}}>
              <Text style={{fontWeight:'bold',marginBottom:8}}>Yeni Ürün Ekle</Text>
              <TextInput placeholder="Ürün Adı" value={newProduct.name} onChangeText={t=>setNewProduct({...newProduct,name:t})} style={styles.input} />
              <TextInput placeholder="Açıklama" value={newProduct.description} onChangeText={t=>setNewProduct({...newProduct,description:t})} style={styles.input} />
              <TextInput placeholder="Fiyat" value={newProduct.price} onChangeText={t=>setNewProduct({...newProduct,price:t})} style={styles.input} keyboardType="numeric" />
              <TextInput placeholder="Stok" value={newProduct.stock} onChangeText={t=>setNewProduct({...newProduct,stock:t})} style={styles.input} keyboardType="numeric" />
              {Platform.OS === 'web' && (
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { productFileInput.current = el; }}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target) {
                        handleProductImageUpload(e);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={{backgroundColor:'#2980b9',padding:8,borderRadius:6,marginRight:8}}
                    onPress={() => (productFileInput.current as HTMLInputElement)?.click()}
                    disabled={productImageUploading}
                  >
                    <Text style={{color:'#fff'}}>{productImageUploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</Text>
                  </TouchableOpacity>
                  <Text style={{fontSize:12,color:'#888'}}>{productImageFileName || (newProduct.image && 'Yüklendi')}</Text>
                </View>
              )}
              <Text style={{marginTop:8,marginBottom:4}}>Kategori</Text>
              <View style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,marginBottom:8,backgroundColor:'#f8f9fa'}}>
                {categories.map(cat => (
                  <TouchableOpacity key={cat.id} onPress={()=>setNewProduct({...newProduct,categoryId:cat.id.toString()})} style={{padding:8,backgroundColor:newProduct.categoryId==cat.id.toString()?'#FF6B00':'transparent'}}>
                    <Text style={{color:newProduct.categoryId==cat.id.toString()?'#fff':'#2c3e50'}}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 24,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  activeTab: {
    backgroundColor: '#FF6B00',
  },
  tabText: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 