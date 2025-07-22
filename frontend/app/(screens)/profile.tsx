// app/(screens)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { User } from '../../types/user'; // Import the User type

export default function ProfileScreen() {
  const params = useLocalSearchParams();

  // Parse the user object from params, or use a fallback dummy user
  const user: User = params.user
    ? JSON.parse(params.user as string)
    : { id: 'default', name: 'Guest', email: 'guest@example.com' }; // Fallback dummy user

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Text style={styles.subtitle}>Your Profile</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>User ID:</Text>
        <Text style={styles.infoValue}>{user.id}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
      </View>

      {/* You can add more profile-related information here,
          e.g., aggregated health stats, last report summary (fetched from a service) */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Current Status:</Text>
        <Text style={styles.infoValue}>Feeling good today!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
});
