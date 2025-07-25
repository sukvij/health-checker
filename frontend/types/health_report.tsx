// types/health_report.ts
export interface HealthReport {
  // ID is the primary key, auto-incrementing integer in GORM, so 'number' in TS.
  id: number; 

  // userId links to the User model's ID, which is a 'uint' in Go, so 'number' in TS.
  userId: number; // Changed to 'number' to match GORM's uint ID

  // Type of the report (e.g., 'Daily Log', 'Symptom Update').
  type: string; 

  // Description of the health report.
  description: string;

  // Date the report refers to (YYYY-MM-DD format).
  date: string; 

  // ISO string for when the report was submitted.
  createdAt: string; 

  // ISO string for when the report was last updated (from GORM's UpdatedAt).
  updatedAt: string; 
  
  // DeletedAt is handled by GORM for soft deletes and is excluded from JSON,
  // so it's not included in this frontend interface.
}
