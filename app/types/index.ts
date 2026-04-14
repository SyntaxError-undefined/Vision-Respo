export type IncidentType =
  | 'fire' | 'attack' | 'medical' | 'natural_disaster'
  | 'accident' | 'hazard' | 'safety' | 'other';

export type FieldType = 'text' | 'boolean' | 'select' | 'number';

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
}

export interface IncidentConfig {
  label: string;
  color: string;
  glowColor: string;
  icon: string;
  fields: FormField[];
}

export interface UserProfile {
  userId: string;
  name: string;
  phone: string;
  venue: string;
  venueId: string;
  floor: string;
  roomNo: string;
  role: 'guest' | 'staff';
}

export interface IncidentReport {
  incidentId: string;
  type: IncidentType;
  reportedBy: string;
  venue: string;
  venueId: string;
  floor: string;
  roomNo: string;
  timestamp: number;
  status: 'active' | 'resolved';
  confirmations: string[];
  confirmationCount: number;
  formData: Record<string, any>;
}

export interface NearbyAlert {
  incidentId: string;
  type: IncidentType;
  venue: string;
  floor: string;
  confirmationCount: number;
  timestamp: number;
}
