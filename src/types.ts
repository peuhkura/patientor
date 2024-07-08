export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: EntriesData[];
}

export interface BaseEntry {
  id: string;
  type: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: string[];
}

export type EntryFormValues = Omit<BaseEntry, "id">;

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string
}

export interface Discharge {
  date: string;
  criteria: string;
}
export interface HospitalEntry extends BaseEntry {
  diagnosisCodes: string[];
  discharge?: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// Define the interface for the entire JSON structure
export interface EntriesData {
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;