// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      if (response.data.status === 'ok') {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Login Successful', 'You are now logged in.');
        // Navigate to a protected screen (if you have one)
        router.push('/home');
      } else {
        Alert.alert('Login Failed', response.data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while logging in.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={loginUser} />
      <Text style={styles.redirectText}>
              Don't have an account?{' '}
              <Text style={styles.linkText} onPress={() => router.push('/register')}>
                SignUp
              </Text>
            </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  input: { 
    borderWidth: 1, 
    padding: 10, 
    marginVertical: 10, 
    borderRadius: 5 
  },
  redirectText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#333'
  },
  linkText: {
    color: '#1e90ff',
    textDecorationLine: 'underline'
  }
});