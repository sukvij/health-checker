// app/(screens)/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// Removed 'useLocalSearchParams' as we're no longer relying on params for user data
import { User } from '../../types/user'; // Import the User type

export default function ProfileScreen() {
  // Removed params as they are no longer used for fetching user data here
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Define the async function to fetch user profile
    const userId = localStorage.getItem("currentUserId")
    const fetchUserProfile = async () => {
      setLoading(true); // Start loading
      setError(null);    // Clear any previous errors

      try {
        // Hardcoded email for direct fetch as per your request
        const userEmailToFetch = "vijju@gmail.com"; 

        const response = await fetch(`http://localhost:8080/user/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          // If the response is not OK (e.g., 404 Not Found, 500 Internal Server Error)
          const errorText = await response.text(); // Get detailed error from backend
          throw new Error(`Failed to fetch user: ${response.status} - ${errorText || response.statusText}`);
        }

        const fetchedUser: User = await response.json();
        setUser(fetchedUser); // Set the fetched user data
        console.log("Fetched user data directly:", fetchedUser);

      } catch (e: any) {
        console.error('Profile API error:', e);
        // Set a user-friendly error message
        setError(`Could not load profile. ${e.message || 'Network error.'}`);
        setUser(null); // Ensure user is null if there's an error
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUserProfile(); // Call the fetch function when the component mounts

    // No dependency array, meaning this effect runs only once after the initial render.
    // If you wanted to refetch when something else changes, you'd add it here.
  }, []); 


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorText}>Please ensure the backend is running and reachable.</Text>
      </View>
    );
  }

  if (!user) {
    // This handles the case where loading is false but user is null (e.g., due to error or no data)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user profile data was retrieved.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name || 'User'}!</Text>
      <Text style={styles.subtitle}>Your Profile</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>User Name:</Text>
        <Text style={styles.infoValue}>{user.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{user.email || 'Not available'}</Text>
      </View>

      {/* You can add more profile-related information here */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
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
