// app/(screens)/dashboard.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { User } from '@/types/user';

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  // console.log(params)

  // Dummy data for quick stats - in a real app, this would come from a service/database
  const quickStats = {
    lastReportDate: 'October 26, 2023',
    aiSuggestionsCount: 5,
    upcomingAppointments: 'None',
  };

  const handleViewProfile = () => {
     router.push('/(screens)/profile');
  };

  const handleSubmitReport = () => {
    router.push('/(screens)/report_form'); // Now correctly navigates to the report form
  };

  const handleViewReports = () => {
    console.log('Navigating to Report List (placeholder)');
    router.push('/(screens)/report_list'); // Uncomment when report_list.tsx is added
  };

  const handleChatWithAI = () => {
    console.log('Navigating to AI Chat (placeholder)');
    router.push('/(screens)/chat_ai'); // Uncomment when chat_ai.tsx is added
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>HealthCheck Dashboard</Text>
      <Text style={styles.subtitle}>Your personalized health overview.</Text>

      <View style={styles.buttonGroup}>
        <CustomButton
          title="View Profile"
          onPress={handleViewProfile}
          style={styles.button}
          color="#007AFF"
        />
        <CustomButton
          title="Submit New Report"
          onPress={handleSubmitReport}
          style={styles.button}
          color="#28a745"
        />
        <CustomButton
          title="View Past Reports"
          onPress={handleViewReports}
          style={styles.button}
          color="#ffc107"
        />
        <CustomButton
          title="Chat with AI"
          onPress={handleChatWithAI}
          style={styles.button}
          color="#6f42c1"
        />
      </View>

      {/* Quick Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Stats</Text>
        <Text style={styles.cardText}>Last Report: {quickStats.lastReportDate}</Text>
        <Text style={styles.cardText}>AI Suggestions: {quickStats.aiSuggestionsCount} new</Text>
        <Text style={styles.cardText}>Upcoming appointments: {quickStats.upcomingAppointments}</Text>
      </View>

      {/* Health Tips Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health Tips</Text>
        <Text style={styles.cardText}>"Remember to drink at least 8 glasses of water daily for optimal hydration!"</Text>
        <Text style={styles.cardText}>"Aim for at least 30 minutes of moderate exercise most days of the week."</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  buttonGroup: {
    marginBottom: 30,
  },
  button: {
    marginBottom: 15, // Space between buttons
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});
