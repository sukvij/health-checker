import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';

export default function EntireReportScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserIdAndFetchReport = async () => {
      try {
        const id = await AsyncStorage.getItem('currentUserId');
        if (!id) {
          Alert.alert('User ID not found in local storage');
          setLoading(false);
          return;
        }
        setUserId(id);
        alert(id)
        const res = await fetch(`https://health-backend-xrim.onrender.com/entire-report/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const rawText = await res.text();

        const formattedText = rawText
          .replace(/\\n/g, '\n')
          .replace(/\*\*/g, '**')
          .replace(/\\\*/g, '*');

        setReport(formattedText);
      } catch (err) {
        console.error('Error loading report:', err);
        Alert.alert('Error', 'Failed to load medical report');
      } finally {
        setLoading(false);
      }
    };

    loadUserIdAndFetchReport();
  }, []);

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
      <Markdown style={markdownStyles}>{report || 'No report available.'}</Markdown>
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
    color: '#222',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bullet_list: {
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
});
