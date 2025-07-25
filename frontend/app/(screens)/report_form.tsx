// app/(screens)/report_form.tsx
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import CustomTextInput from '../../components/CustomTextInput'; // Import CustomTextInput
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import { HealthReport } from '../../types/health_report'; // Import HealthReport type
import { User } from '@/types/user';

export default function ReportFormScreen() {
  const router = useRouter();
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to current date
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Renamed for clarity

  // States for fetching current user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string | null>(null);
// Empty dependency array means this runs once on mount

  const handleSubmitReport = async () => {
    // 1. Validate inputs
    if (!reportType || !description || !date) {
      Alert.alert('Error', 'Please fill in all fields (Report Type, Date, Description).');
      return;
    }

    // 2. Ensure user ID is available
    // if (!currentUser?.id) {
    //   Alert.alert('Error', 'User ID is not available. Please try again or contact support.');
    //   console.error('Submission error: currentUser.id is missing.');
    //   return;
    // }

    const userId = localStorage.getItem("currentUserId")
    setIsSubmitting(true); // Start submission loading

    // Construct the new report object WITHOUT the 'id' field
    const newReportData = {
      userId: Number(userId), // Use the fetched user's ID
      type: reportType,
      description: description,
      date: date,
      // createdAt and updatedAt will be handled by the backend
    };

    console.log('Attempting to submit report:', newReportData);

    try {
      const response = await fetch(`http://localhost:8080/health-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReportData), // Send the data without 'id'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create report: ${response.status} - ${errorText || response.statusText}`);
      }

      // If needed, you can parse the response to get the newly created report (which will have the ID)
      const createdReport: HealthReport = await response.json();
      console.log('Report submitted successfully:', createdReport);

      Alert.alert('Success', 'Health report submitted successfully!');
      router.back(); // Go back to the previous screen (e.g., Dashboard)

    } catch (e: any) {
      console.error('Report submission API error:', e);
      Alert.alert('Submission Failed', `Could not create report. ${e.message || 'Network error.'}`);
    } finally {
      setIsSubmitting(false); // Stop submission loading
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back to Dashboard</Text>
      </TouchableOpacity> */}

      <Text style={styles.title}>Submit New Health Report</Text>
      <Text style={styles.subtitle}>Record your health observations and activities.</Text>

      <CustomTextInput
        placeholder="Report Type (e.g., Daily Log, Symptom Update, Activity)"
        value={reportType}
        onChangeText={setReportType}
        style={styles.input}
      />
      <CustomTextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        keyboardType="numbers-and-punctuation"
      />
      <CustomTextInput
        placeholder="Description (e.g., 'Felt tired today', 'Ran 5k', 'Mild headache')"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        style={[styles.input, styles.textArea]}
      />

      <CustomButton
        title={isSubmitting ? 'Submitting...' : 'Submit Report'}
        onPress={handleSubmitReport}
        disabled={isSubmitting}
        style={styles.submitButton}
      />
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
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
    marginBottom: 30,
    color: '#666',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
  backButton: {
    alignSelf: 'flex-start',
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
