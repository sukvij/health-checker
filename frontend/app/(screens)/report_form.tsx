// app/(screens)/report_form.tsx
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import CustomTextInput from '../../components/CustomTextInput'; // Import CustomTextInput
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import { HealthReport } from '../../types/health_report'; // Import HealthReport type

export default function ReportFormScreen() {
  const router = useRouter();
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to current date
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitReport = async () => {
    if (!reportType || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // --- DUMMY DATA AND SIMULATED API CALL ---
    // In a real app, you would send this data to your backend API.
    // The userId would typically come from an authentication context.
    const newReport: HealthReport = {
      id: `report-${Date.now()}`, // Dummy ID
      userId: 'dummyUser123', // Dummy User ID
      type: reportType,
      description: description,
      date: date,
      createdAt: new Date().toISOString(),
    };

    console.log('Simulating report submission:', newReport);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    setIsLoading(false);

    // Simulate success
    Alert.alert('Success', 'Health report submitted successfully!');
    router.back(); // Go back to the previous screen (e.g., Dashboard)
    // --- END DUMMY DATA ---
  };

  return (
    <ScrollView style={styles.container}>
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
        keyboardType="numbers-and-punctuation" // Suggests numeric keyboard for date
      />
      <CustomTextInput
        placeholder="Description (e.g., 'Felt tired today', 'Ran 5k', 'Mild headache')"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6} // Make the input taller for descriptions
        style={[styles.input, styles.textArea]}
      />

      <CustomButton
        title={isLoading ? 'Submitting...' : 'Submit Report'}
        onPress={handleSubmitReport}
        disabled={isLoading}
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
    height: 120, // Make multiline input taller
    textAlignVertical: 'top', // Align text to top for multiline
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
});
