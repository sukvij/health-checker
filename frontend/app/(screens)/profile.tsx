// app/(screens)/profile.tsx
import { use, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import { User } from '../../types/user'; // Import the User type

export default function ProfileScreen() {
  const params = useLocalSearchParams(); // Get parameters from the route

  // Parse the user object from params, or use a fallback dummy user
  // const user: User = params.user
  const user = JSON.parse(params.user as string); // Fallback dummy user

  console.log(user)
  const [symptoms, setSymptoms] = useState<string>('');
  const [medication, setMedication] = useState<string>('');
  const [report, setReport] = useState<string>('');

  const handleSubmitHealthData = async () => {
    // Simulate submitting health data
    console.log('Submitting health data:', { symptoms, medication });
    // In a real app, this would be an API call to save data
    setReport('Health data submitted successfully! Awaiting AI suggestion and report generation.');
  };

  const handleGetSuggestion = async () => {
    // Simulate getting AI suggestion
    console.log('Requesting AI suggestion for symptoms:', symptoms);
    // In a real app, this would be an API call to an AI model
    setReport(
      'AI Suggestion: Based on your symptoms, consider consulting a doctor for further diagnosis. Ensure you get adequate rest and stay hydrated.'
    );
  };

  const handleGetReport = async () => {
    // Simulate getting health report
    console.log('Requesting health report');
    // In a real app, this would be an API call to fetch a detailed report
    setReport(
      `Health Report for ${user.name}:\n\n` + // Use the passed user's name
      `Symptoms Reported: ${symptoms || 'None'}\n` +
      `Medications: ${medication || 'None'}\n\n` +
      `Summary: Your health data has been recorded. Regular updates will help in better health management. Please consult a healthcare professional for personalized advice.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Text style={styles.subtitle}>Manage Your Health</Text>

      <Text style={styles.sectionTitle}>Record Health Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter symptoms (e.g., headache, fever, cough)"
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
        numberOfLines={4}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter medications (e.g., Paracetamol, Ibuprofen)"
        value={medication}
        onChangeText={setMedication}
        multiline
        numberOfLines={4}
        placeholderTextColor="#888"
      />
      <View style={styles.buttonGroup}>
        <Button title="Submit Health Data" onPress={handleSubmitHealthData} color="#007AFF" />
      </View>

      <Text style={styles.sectionTitle}>Get Insights</Text>
      <View style={styles.buttonGroup}>
        <Button title="Get AI Suggestion" onPress={handleGetSuggestion} color="#28a745" />
        <View style={styles.buttonSpacer} />
        <Button title="View Health Report" onPress={handleGetReport} color="#ffc107" />
      </View>

      {report ? (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Health Report / AI Suggestion</Text>
          <Text style={styles.reportText}>{report}</Text>
        </View>
      ) : null}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top', // For multiline TextInput
  },
  buttonGroup: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10, // Space between buttons
  },
  reportContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  reportText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
