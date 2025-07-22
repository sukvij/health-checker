// components/HealthReportCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HealthReport } from '../types/health_report'; // Adjust path as needed

interface HealthReportCardProps {
  report: HealthReport;
}

const HealthReportCard: React.FC<HealthReportCardProps> = ({ report }) => {
  // Format date for better readability
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedCreatedAt = new Date(report.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.reportType}>{report.type}</Text>
        <Text style={styles.reportDate}>{formattedDate}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.reportDescription}>{report.description}</Text>
      <Text style={styles.reportTimestamp}>Recorded: {formattedCreatedAt}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12, // More rounded corners
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Stronger shadow for depth
    shadowOpacity: 0.08, // Lighter shadow opacity
    shadowRadius: 8,
    elevation: 5, // Android shadow
    borderLeftWidth: 6, // Thicker left border
    borderLeftColor: '#007AFF', // Vibrant blue accent
    overflow: 'hidden', // Ensure content respects border radius
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportType: {
    fontSize: 20, // Larger font for type
    fontWeight: '700', // Bolder
    color: '#333',
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0', // Light grey divider
    marginBottom: 15,
  },
  reportDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24, // Improved line spacing for readability
    marginBottom: 15,
  },
  reportTimestamp: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'right',
  },
});

export default HealthReportCard;
