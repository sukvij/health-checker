// app/(screens)/login.tsx
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { User } from '../../types/user'; // Import the User type
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null); // State to display login errors
  const router = useRouter();

  const handleLogin = async () => {
    setLoginError(null); // Clear any previous errors
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      return;
    }

    console.log('Attempting login with:', { email, password });

    try {
      // In a real app, you would send email and password via POST for authentication.
      // For this example, assuming GET call to fetch user details by email after a "successful" login.
      const response = await fetch(`http://localhost:8080/user/login/${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // If response is not OK (e.g., 404 Not Found, 401 Unauthorized)
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed: Invalid credentials or user not found.');
      }

      const user: User = await response.json();
      console.log('User data fetched:', user);

      // --- Store user.id in AsyncStorage ---
      // We store the ID as a string. Convert 'number' to 'string'.
      await localStorage.setItem('currentUserId', String(user.id));
      console.log('User ID stored in AsyncStorage:', user.id);
      // --- End AsyncStorage logic ---

      // Navigate to the dashboard screen
      // We no longer need to pass the user object in params if other screens fetch by stored ID
      router.replace('/(screens)/dashboard'); 
      
    } catch (error: any) {
      console.error('Login API error:', error);
      setLoginError(error.message || 'An unexpected error occurred during login. Please try again.');
      // Display a more prominent alert for critical errors
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred. Please try again.');
    }
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

      {/* Display login-specific errors below the button */}
      {loginError && <Text style={styles.errorText}>{loginError}</Text>} 

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
  errorText: { // Added style for login error messages
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
  },
});
