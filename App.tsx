import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartScreen from './app/cart';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <CartProvider>
          <Stack.Navigator>
            <Stack.Screen 
              name="Cart" 
              component={CartScreen}
              options={{
                title: 'Sepetim',
                headerStyle: {
                  backgroundColor: '#2ecc71',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
          </Stack.Navigator>
        </CartProvider>
      </AuthProvider>
    </NavigationContainer>
  );
} 