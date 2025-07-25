// app/(screens)/signup.tsx
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const handleSignUp = async () => {
    // In a real app, you would perform user registration here (e.g., API call)
    console.log('Attempting sign up with:', { email, password, confirmPassword });

    if (password !== confirmPassword) {
      // In a real app, show an error message to the user
      console.error("Passwords do not match!");
      return;
    }
  try {
    const response = await fetch('http://localhost:8080/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email":email }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    console.log(data)
    // Simulate successful signup and navigate to login or profile
    router.replace('/(screens)/login'); // After signup, typically go to login
    return true;
  } catch (error) {
    console.error('Login API error:', error);
    return false;
  }

    
    // Or, if you auto-login after signup: router.replace('/(screens)/profile');
  };

  const handleGoToLogin = () => {
    router.push('/(screens)/login');
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#28a745" />

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={handleGoToLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
