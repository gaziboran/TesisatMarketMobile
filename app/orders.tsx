import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { getUserOrders } from './services/api';
import { useRouter } from 'expo-router';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface Order {
  id: number;
  userId: number;
  address: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
    if (!user) {
      router.replace('/(tabs)');
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) {
      console.error('Kullanıcı ID bulunamadı');
      return;
    }

    try {
      const data = await getUserOrders(user.id);
      console.log('Siparişler getirildi:', data);
      
      // Veri kontrolü yap
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Geçersiz veri formatı:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Siparişler getirilirken hata:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı giriş yapmamışsa yükleme ekranını göster
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz bir siparişiniz yok</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
            </Text>
            <Text style={[
              styles.orderStatus,
              { color: order.status === 'pending' ? '#f39c12' : '#27ae60' }
            ]}>
              {order.status === 'pending' ? 'Beklemede' : 'Tamamlandı'}
            </Text>
          </View>

          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <View style={styles.itemDetails}>
                <Text style={styles.quantity}>Adet: {item.quantity}</Text>
                <Text style={styles.price}>₺{item.price.toFixed(2)}</Text>
              </View>
            </View>
          ))}

          <View style={styles.orderFooter}>
            <Text style={styles.address}>{order.address}</Text>
            <Text style={styles.total}>Toplam: ₺{order.total.toFixed(2)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  orderDate: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItem: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  price: {
    fontSize: 14,
    color: '#2980b9',
    fontWeight: '600',
  },
  orderFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  address: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'right',
  },
}); 