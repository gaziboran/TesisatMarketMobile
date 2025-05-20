import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getCategories } from '../services/api';

interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    icon: string;
}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Kategoriler</Text>
            <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() => router.push(`/category/${category.id}`)}
                    >
                        <Image
                            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${category.image}` }}
                            style={styles.categoryImage}
                        />
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text style={styles.categoryName}>{category.name}</Text>
                            <Text style={styles.categoryDescription}>{category.description}</Text>
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
    },
    categoriesContainer: {
        padding: 10,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    categoryImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    categoryInfo: {
        padding: 15,
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
    },
}); 