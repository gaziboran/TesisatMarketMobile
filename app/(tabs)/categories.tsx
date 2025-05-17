import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  slug?: string;
}

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        if (!response.ok) throw new Error('Kategoriler alınamadı');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError('Kategoriler alınamadı');
        console.error('Kategori çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => router.push(`/products?category=${encodeURIComponent(item.name)}`)}
    >
      <Image source={{ uri: item.image ? `http://localhost:3001${item.image}` : 'https://via.placeholder.com/100x100?text=Kategori' }} style={styles.categoryImage} />
      <View style={styles.categoryInfo}>
        {item.icon ? (
          <Ionicons name={item.icon as any} size={24} color="#2980b9" />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={styles.categoryTitle}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.categoryDesc}>{item.description}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategoriler</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.categoriesGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  categoriesGrid: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  categoryImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  categoryInfo: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#2c3e50',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#7f8c8d',
    marginLeft: 12,
    marginTop: 2,
  },
}); 