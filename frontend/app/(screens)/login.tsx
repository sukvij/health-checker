// app/(screens)/login.tsx
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler'; // Using TextInput from gesture-handler as per your original code
import { useRouter } from 'expo-router';
import { User } from '../../types/user'; // Import the User type

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, you would perform authentication here (e.g., API call)
    // For this example, we'll simulate a successful login and navigate to profile
    console.log('Attempting login with:', { email, password });

    // Dummy user data for demonstration
    const dummyUser: User = {
      id: 'user123',
      name: 'Vijju',
      email: email || 'vijju@example.com',
      // Add other user properties as needed
    };

    // Navigate to the profile screen, passing dummy user data as a JSON string
    router.replace({
      pathname: '/(screens)/dashboard',
      params: { user: JSON.stringify(dummyUser) },
    });
  };

  const handleGoToSignUp = () => {
    router.push('/(screens)/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#007AFF" />

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleGoToSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
