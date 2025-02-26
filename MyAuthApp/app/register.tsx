// app/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        <Text style={styles.linkText} onPress={() => router.push('/login')}>
          Log in
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