import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Linking } from 'react-native';

const googleLogo = require('../assets/google.png');

export default function GoogleAuthButton() {
  const continueWithGoogle = () => {
    // Opens the Google OAuth endpoint in the device's default browser.
    const url = 'http://localhost:3000/auth/google';
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={continueWithGoogle}>
      <Image source={googleLogo} style={styles.logo} />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
    marginTop: 20,
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
});

