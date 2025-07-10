// app/screen/signup.tsx
import { View, Text, StyleSheet, Button, TextInput, ActivityIndicator } from 'react-native'; // Import TextInput from 'react-native'
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const router = useRouter();

  const handleSignup = async () => {
    setMessage(''); // Clear previous messages
    setMessageType('');
    setLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setLoading(false); // Stop loading

      if (response.status === 201) { // Assuming 201 Created for successful user creation
        setMessage('Sign Up successful! Please log in.');
        setMessageType('success');
        // Optionally navigate to the login screen after a short delay
        setTimeout(() => {
          // router.replace('/(screen)/login'); // Use replace to prevent going back to signup
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Sign Up failed: ${errorData.message || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      setLoading(false); // Stop loading
      console.error('Network error during signup:', error);
      setMessage('Network error. Please try again later.');
      setMessageType('error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading} // Disable input while loading
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading} // Disable input while loading
      />
      <Button
        title={loading ? "Signing Up..." : "Sign Up"}
        onPress={handleSignup}
        color="#28a745" // A green color for sign up
        disabled={loading} // Disable button while loading
      />

      {loading && <ActivityIndicator size="small" color="#007AFF" style={styles.activityIndicator} />}

      {message ? (
        <Text style={[styles.message, messageType === 'error' ? styles.errorMessage : styles.successMessage]}>
          {message}
        </Text>
      ) : null}

      <View style={styles.spacer} />
      <Button
        title="Go Back"
        onPress={() => router.back()}
        color="#6c757d"
        disabled={loading} // Disable button while loading
      />
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
    fontSize: 28, // Slightly larger title
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // More space below title
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15, // More padding
    marginBottom: 15, // More space between inputs
    borderRadius: 8, // Slightly more rounded corners
    fontSize: 16, // Larger font size
    backgroundColor: '#fff', // White background for inputs
  },
  message: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  successMessage: {
    backgroundColor: '#d4edda', // Light green
    color: '#155724', // Dark green text
  },
  errorMessage: {
    backgroundColor: '#f8d7da', // Light red
    color: '#721c24', // Dark red text
  },
  activityIndicator: {
    marginTop: 10,
  },
  spacer: {
    height: 20, // Space between signup button and back button
  },
});