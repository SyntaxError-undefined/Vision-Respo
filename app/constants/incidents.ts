import { IncidentConfig, IncidentType } from '../types/index';

export const INCIDENTS: Record<IncidentType, IncidentConfig> = {
  fire: {
    label: 'Fire',
    color: '#FF4500',
    glowColor: '#FF450066',
    icon: '🔥',
    fields: [
      { id: 'floor', label: 'Which floor?', type: 'text', required: true },
      { id: 'wing', label: 'Wing or area', type: 'text', required: false },
      { id: 'spreading', label: 'Is it spreading?', type: 'boolean', required: true },
      { id: 'trapped', label: 'People trapped?', type: 'boolean', required: true },
    ],
  },
  attack: {
    label: 'Attack',
    color: '#8B0000',
    glowColor: '#8B000066',
    icon: '⚠️',
    fields: [
      {
        id: 'attackType',
        label: 'Type of attack',
        type: 'select',
        options: ['Armed', 'Physical', 'Verbal', 'Unknown'],
        required: true,
      },
      { id: 'description', label: 'Attacker description', type: 'text', required: false },
      { id: 'direction', label: 'Direction or area', type: 'text', required: true },
      { id: 'weapon', label: 'Weapon involved?', type: 'boolean', required: true },
    ],
  },
  medical: {
    label: 'Medical',
    color: '#1565C0',
    glowColor: '#1565C066',
    icon: '🏥',
    fields: [
      { id: 'victimCount', label: 'Number of victims', type: 'number', required: true },
      { id: 'conscious', label: 'Is victim conscious?', type: 'boolean', required: true },
      {
        id: 'injuryType',
        label: 'Injury type',
        type: 'select',
        options: ['Cardiac', 'Trauma', 'Breathing', 'Seizure', 'Unknown'],
        required: true,
      },
      {
        id: 'defibrillator',
        label: 'Defibrillator needed?',
        type: 'boolean',
        required: false,
      },
    ],
  },
  natural_disaster: {
    label: 'Natural Disaster',
    color: '#37474F',
    glowColor: '#37474F66',
    icon: '🌪️',
    fields: [
      {
        id: 'disasterType',
        label: 'Disaster type',
        type: 'select',
        options: ['Earthquake', 'Flood', 'Storm', 'Fire', 'Other'],
        required: true,
      },
      {
        id: 'structuralDamage',
        label: 'Structural damage?',
        type: 'boolean',
        required: true,
      },
      { id: 'evacuation', label: 'Evacuation needed?', type: 'boolean', required: true },
    ],
  },
  accident: {
    label: 'Accident',
    color: '#E65100',
    glowColor: '#E6510066',
    icon: '🚗',
    fields: [
      { id: 'vehicleCount', label: 'Vehicles involved', type: 'number', required: true },
      { id: 'injuries', label: 'Injuries reported?', type: 'boolean', required: true },
      { id: 'location', label: 'Location in venue', type: 'text', required: true },
      { id: 'fireRisk', label: 'Fire risk present?', type: 'boolean', required: true },
    ],
  },
  hazard: {
    label: 'Hazard',
    color: '#F9A825',
    glowColor: '#F9A82566',
    icon: '☣️',
    fields: [
      {
        id: 'substanceType',
        label: 'Substance type',
        type: 'select',
        options: ['Chemical', 'Biological', 'Gas Leak', 'Radiation', 'Unknown'],
        required: true,
      },
      { id: 'contained', label: 'Is it contained?', type: 'boolean', required: true },
      {
        id: 'evacuationRadius',
        label: 'Evacuation radius',
        type: 'select',
        options: ['10m', '25m', '50m', 'Full floor', 'Full building'],
        required: true,
      },
    ],
  },
  safety: {
    label: 'Safety',
    color: '#1a2a4a',
    glowColor: '#1e90ff44',
    icon: '🛡️',
    fields: [
      { id: 'concern', label: 'Safety concern', type: 'text', required: true },
      {
        id: 'immediateDanger',
        label: 'Immediate danger?',
        type: 'boolean',
        required: true,
      },
      { id: 'location', label: 'Location', type: 'text', required: true },
    ],
  },
  other: {
    label: 'Other',
    color: '#1a2a4a',
    glowColor: '#f59e0b44',
    icon: '❗',
    fields: [
      { id: 'description', label: 'Describe the situation', type: 'text', required: true },
      {
        id: 'urgency',
        label: 'Urgency level',
        type: 'select',
        options: ['Low', 'Medium', 'High', 'Critical'],
        required: true,
      },
      { id: 'location', label: 'Location', type: 'text', required: true },
    ],
  },
};
