// app/(screens)/report_list.tsx
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import HealthReportCard from '../../components/HealthReportCard'; // Import HealthReportCard
import { HealthReport } from '../../types/health_report'; // Import HealthReport type

export default function ReportListScreen() {
  const router = useRouter(); // Initialize useRouter
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId")
    const fetchHealthReports = async () => {
      setIsLoading(true); // Start loading
      setError(null);     // Clear any previous errors

      try {
        // Fetching all reports from the backend
        const response = await fetch(`http://localhost:8080/health-reports/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch reports: ${response.status} - ${errorText || response.statusText}`);
        }

        const fetchedReports: HealthReport[] = await response.json();
        setReports(fetchedReports); // Update state with fetched reports
        console.log("Fetched health reports:", fetchedReports);

      } catch (e: any) {
        console.error('Fetch reports API error:', e);
        setError(`Could not load reports. ${e.message || 'Network error.'}`);
      } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchHealthReports(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  // Handler for navigating back to the dashboard
  // const handleGoToDashboard = () => {
  //   router.back(); // Go back to the previous screen (Dashboard)
  // };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorText}>Please ensure the backend is running and reachable.</Text>
        {/* <TouchableOpacity onPress={handleGoToDashboard} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Dashboard</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {/* <TouchableOpacity onPress={handleGoToDashboard} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity> */}
      
      <Text style={styles.title}>My Health Reports</Text>
      <Text style={styles.subtitle}>A history of your health observations.</Text>

      {reports.length === 0 ? (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.noReportsText}>No reports found. Submit one from the Dashboard!</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => String(item.id)} // Use item.id as key, converted to string
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
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start', // Align to the left
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
