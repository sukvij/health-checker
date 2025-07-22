// types/health_report.ts
export interface HealthReport {
  id: string;
  userId: string; // To link the report to a specific user
  type: string; // e.g., 'Daily Log', 'Symptom Update', 'Activity'
  description: string;
  date: string; // YYYY-MM-DD format for the date the report refers to
  createdAt: string; // ISO string for when the report was submitted
  // Add other fields as needed, e.g., attachments, severity, etc.
}
