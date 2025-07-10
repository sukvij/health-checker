// app/index.tsx
import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; // Use useRouter for navigation in Expo Router

export default function HomeScreen() {
  const router = useRouter(); // Initialize the router hook

  const handleLoginPress = () => {
    // Navigate to the login screen using its file-system path
    router.push('/(screens)/login');
  };

  const handleSignUpPress = () => {
    // Navigate to the signup screen using its file-system path
    router.push('/(screens)/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HealthCheck!</Text>
      <Text style={styles.subtitle}>Your journey to better well-being starts here.</Text>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLoginPress} color="#007bff" />
        <Button title="Sign Up" onPress={handleSignUpPress} color="#28a745" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#6c757d',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});