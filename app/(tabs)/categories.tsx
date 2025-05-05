import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  {
    id: '1',
    name: 'Su Tesisatı',
    icon: 'water-outline',
    image: 'https://www.sutesisatfirmasi.com/wp-content/uploads/2023/05/Ucuz-Tesisatci.png',
  },
  {
    id: '2',
    name: 'Elektrik',
    icon: 'flash-outline',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/320571543/VB/DG/PK/21448494/residential-electrical-work-services.jpg',
  },
  {
    id: '3',
    name: 'Isıtma',
    icon: 'thermometer-outline',
    image: 'https://www.deltamekanik.com.tr/images/isitma-sistemleri.jpg',
  },
  {
    id: '4',
    name: 'Hırdavat',
    icon: 'hammer-outline',
    image: 'https://ideacdn.net/idea/hi/39/myassets/blogs/hirdavat.jpeg?revision=1677512276',
  },
];

export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategoriler</Text>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
          >
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <View style={styles.categoryInfo}>
              <Ionicons name={category.icon as any} size={24} color="#2980b9" />
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
}); 