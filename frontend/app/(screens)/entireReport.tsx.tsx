import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export default function EntireReportScreen() {
  const { user_id } = useLocalSearchParams();
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_id) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`https://health-backend-xrim.onrender.com/entire-report/${user_id}`);
        const text = await res.text(); // because AI returns plain text
        setReport(text);
      } catch (e) {
        Alert.alert('Error', 'Failed to load medical report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user_id]);

  const handleDownloadPDF = async () => {
    try {
      const html = `<html><body><pre style="font-size: 16px;">${report.replace(/\n/g, '<br/>')}</pre></body></html>`;
      const { uri } = await Print.printToFileAsync({ html });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('PDF Error', 'Unable to generate or share PDF');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Generating report...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>📋 AI-Generated Medical Summary</Text>
      <Markdown style={markdownStyles}>{report}</Markdown>
      <Button title="Download as PDF" onPress={handleDownloadPDF} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  bullet_list: {
    marginVertical: 8,
    paddingLeft: 16,
  },
  list_item: {
    marginBottom: 5,
  },
});
