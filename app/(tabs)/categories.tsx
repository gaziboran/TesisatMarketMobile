import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  {
    id: 1,
    name: 'Su Tesisatı',
    icon: 'water' as const,
    subcategories: ['Musluklar', 'Borular', 'Vanalar', 'Pompalar']
  },
  {
    id: 2,
    name: 'Elektrik',
    icon: 'flash' as const,
    subcategories: ['Kablolar', 'Anahtarlar', 'Prizler', 'Aydınlatma']
  },
  {
    id: 3,
    name: 'Hırdavat',
    icon: 'hammer' as const,
    subcategories: ['El Aletleri', 'Vidalar', 'Çiviler', 'Tornavidalar']
  },
  {
    id: 4,
    name: 'Isıtma',
    icon: 'flame' as const,
    subcategories: ['Kombiler', 'Radyatörler', 'Petekler', 'Termostatlar']
  }
];

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {categories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={24} color="#007AFF" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
            
            <View style={styles.subcategories}>
              {category.subcategories.map((subcategory, index) => (
                <TouchableOpacity key={index} style={styles.subcategoryItem}>
                  <Text style={styles.subcategoryText}>{subcategory}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  subcategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  subcategoryItem: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  subcategoryText: {
    fontSize: 14,
    color: '#666',
  },
}); 