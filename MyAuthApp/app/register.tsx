// app/register.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Linking } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();


  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const token = extractToken(event.url);
      if (token) {
        await AsyncStorage.setItem('token', token);
        Alert.alert('Login Successful', 'You are now logged in.');
        router.push('/home');
      }
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => {
      subscription.remove();
    };
  }, []);

  // Utility function to extract token from URL query parameters
  const extractToken = (url: string): string | null => {
    // Expected URL format: myapp://auth?token=YOUR_JWT_TOKEN
    const tokenMatch = url.match(/token=([^&]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  };

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3000/register', { email, name, password });
      if (response.data.status === 'ok') {
        Alert.alert('Registration Successful', 'Please log in with your credentials.');
        router.push('/home');
      } else {
        Alert.alert('Registration Failed', response.data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during registration.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={registerUser} />
      {/* <Button title="Go to Login" onPress={() => router.push('/login')} /> */}
      <Text style={styles.redirectText}>
        Already have an account?{' '}
        <Text style={styles.linkText} onPress={() => router.push('/')}>
          Log in
        </Text>
      </Text>
       <GoogleAuthButton />
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