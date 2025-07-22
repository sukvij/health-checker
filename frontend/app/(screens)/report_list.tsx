// app/(screens)/report_list.tsx
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import HealthReportCard from '../../components/HealthReportCard'; // Import HealthReportCard
import { HealthReport } from '../../types/health_report'; // Import HealthReport type

export default function ReportListScreen() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Dummy data for health reports
  const dummyReports: HealthReport[] = [
    {
      id: 'dummyRep1',
      userId: 'dummyUser123',
      type: 'Daily Log',
      description: 'Felt energetic and completed a 30-minute walk.',
      date: '2023-11-01',
      createdAt: '2023-11-01T10:00:00Z',
    },
    {
      id: 'dummyRep2',
      userId: 'dummyUser123',
      type: 'Symptom Update',
      description: 'Experienced mild headache in the evening, took rest.',
      date: '2023-10-31',
      createdAt: '2023-10-31T18:30:00Z',
    },
    {
      id: 'dummyRep3',
      userId: 'dummyUser123',
      type: 'Activity',
      description: 'Yoga session for 45 minutes. Feeling flexible!',
      date: '2023-10-30',
      createdAt: '2023-10-30T07:15:00Z',
    },
    {
      id: 'dummyRep4',
      userId: 'dummyUser123',
      type: 'Food Log',
      description: 'Had a balanced meal with greens and protein.',
      date: '2023-10-29',
      createdAt: '2023-10-29T13:00:00Z',
    },
  ];

  useEffect(() => {
    // Simulate fetching data from a database
    console.log("Simulating fetching reports from database...");

    // Use setTimeout to mimic an asynchronous database fetch
    const fetchTimeout = setTimeout(() => {
      // In a real application, this is where you would call your database API
      // Example: const fetchedData = await yourDatabaseService.getReports(userId);
      // For now, we're using dummyReports.
      setReports(dummyReports);
      setIsLoading(false);
      console.log("Reports fetched (dummy data):", dummyReports);
    }, 1500); // Simulate a 1.5-second network delay

    // Cleanup function: clear the timeout if the component unmounts
    return () => clearTimeout(fetchTimeout);
  }, []); // Empty dependency array means this effect runs once on mount

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Health Reports</Text>
      <Text style={styles.subtitle}>A history of your health observations.</Text>

      {reports.length === 0 ? (
        <Text style={styles.noReportsText}>No reports found. Submit one from the Dashboard!</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id} // Unique key for each item
          renderItem={({ item }) => <HealthReportCard report={item} />}
          contentContainerStyle={styles.listContent} // Apply padding to the content of the list
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20, // Add some padding at the bottom of the list
  },
  noReportsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
});
