import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

const Profile = ({  }) => {
    //   const { user } = route.params;
  const [symptoms, setSymptoms] = useState<string>('');
  const [medication, setMedication] = useState<string>('');
  const [report, setReport] = useState<string>('');
    const handleSubmitHealthData = async () => {
    // try {
    // //   await saveHealthData(user.email, { symptoms, medication, date: new Date().toISOString() });
    //   Alert.alert('Success', 'Health data saved');
    //   setSymptoms('');
    //   setMedication('');
    // } catch () {
    //   Alert.alert('Error', 'Failed to save health data');
    // }
  };

  const handleGetSuggestion = async () => {
    // try {
    //   const suggestion = await getHealthSuggestion(user.email, symptoms);
    //   Alert.alert('AI Suggestion', suggestion);
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to get suggestion');
    // }
  };

  const handleGetReport = async () => {
    // try {
    //   const healthReport = await getHealthReport(user.email);
    //   setReport(healthReport);
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to generate report');
    // }
  };
    return (
            <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {"vijju"}</Text>
      <Text style={styles.subtitle}>Manage Your Health</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Enter medications"
        value={medication}
        onChangeText={setMedication}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Submit Health Data" onPress={handleSubmitHealthData} color="#007AFF" />
        <View style={styles.buttonSpacer} />
        <Button title="Get AI Suggestion" onPress={handleGetSuggestion} color="#007AFF" />
        <View style={styles.buttonSpacer} />
        <Button title="View Health Report" onPress={handleGetReport} color="#007AFF" />
      </View>
      {report ? (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>Health Report</Text>
          <Text style={styles.reportText}>{report}</Text>
        </View>
      ) : null}
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  subtitle: { fontSize: 20, textAlign: 'center', color: '#666', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { marginTop: 20 },
  buttonSpacer: { height: 10 },
  reportContainer: { marginTop: 20, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  reportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  reportText: { fontSize: 16, color: '#333' },
});
export default Profile;