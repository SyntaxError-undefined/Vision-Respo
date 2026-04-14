import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Alert
} from 'react-native';
import { THEME } from '../constants/theme';
import { useProfile } from '../hooks/useProfile';
import { UserProfile } from '../types/index';

const VENUES = ['Grand Hyatt', 'Marriott', 'Taj Hotels', 'Oberoi', 'ITC Hotels', 'Other'];

export function OnboardingScreen({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const { saveProfile } = useProfile();
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2 fields
  const [venue, setVenue] = useState('');
  const [floor, setFloor] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [showVenueDropdown, setShowVenueDropdown] = useState(false);

  // Step 3 fields
  const [role, setRole] = useState<'guest' | 'staff' | null>(null);

  const goNext = () => {
    if (step === 1) {
      if (!name.trim() || !phone.trim()) {
        Alert.alert('Required', 'Please enter your name and phone number.');
        return;
      }
    }
    if (step === 2) {
      if (!venue.trim() || !floor.trim() || !roomNo.trim()) {
        Alert.alert('Required', 'Please fill in all venue details.');
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!role) {
      Alert.alert('Required', 'Please select your role.');
      return;
    }
    const profile: UserProfile = {
      userId: `user_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      venue: venue.trim(),
      venueId: venue.trim().toLowerCase().replace(/\s+/g, '_'),
      floor: floor.trim(),
      roomNo: roomNo.trim(),
      role,
    };
    await saveProfile(profile);
    onComplete(profile);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Text style={styles.appName}>VISION RESPONSE</Text>
        <Text style={styles.subtitle}>Emergency Reporting Setup</Text>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.progressDot, step >= i && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Step {step} of 3</Text>

        {/* STEP 1 — Personal Info */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepDesc}>
              This helps first responders identify you during an emergency.
            </Text>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={THEME.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor={THEME.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        )}

        {/* STEP 2 — Venue Info */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Venue Details</Text>
            <Text style={styles.stepDesc}>
              Your exact location so responders reach you instantly.
            </Text>

            <Text style={styles.fieldLabel}>Venue / Property</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowVenueDropdown(!showVenueDropdown)}
            >
              <Text style={{ color: venue ? THEME.text : THEME.textMuted }}>
                {venue || 'Select your venue'}
              </Text>
            </TouchableOpacity>

            {showVenueDropdown && (
              <View style={styles.dropdown}>
                {VENUES.map(v => (
                  <TouchableOpacity
                    key={v}
                    style={styles.dropdownItem}
                    onPress={() => { setVenue(v); setShowVenueDropdown(false); }}
                  >
                    <Text style={styles.dropdownText}>{v}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.fieldLabel}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3"
              placeholderTextColor={THEME.textMuted}
              value={floor}
              onChangeText={setFloor}
              keyboardType="number-pad"
            />

            <Text style={styles.fieldLabel}>Room / Unit Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 302"
              placeholderTextColor={THEME.textMuted}
              value={roomNo}
              onChangeText={setRoomNo}
              keyboardType="number-pad"
            />
          </View>
        )}

        {/* STEP 3 — Role */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Role</Text>
            <Text style={styles.stepDesc}>
              Staff get additional response options during an emergency.
            </Text>

            <TouchableOpacity
              style={[styles.roleCard, role === 'guest' && styles.roleCardActive]}
              onPress={() => setRole('guest')}
            >
              <Text style={styles.roleIcon}>🧳</Text>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.roleTitle}>Guest</Text>
                <Text style={styles.roleDesc}>Visitor or hotel guest staying at the property</Text>
              </View>
              {role === 'guest' && <Text style={{ color: THEME.accent, fontSize: 20 }}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'staff' && styles.roleCardActive]}
              onPress={() => setRole('staff')}
            >
              <Text style={styles.roleIcon}>👷</Text>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.roleTitle}>Staff Member</Text>
                <Text style={styles.roleDesc}>Employee or personnel working at this venue</Text>
              </View>
              {role === 'staff' && <Text style={{ color: THEME.accent, fontSize: 20 }}>✓</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          {step < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={goNext}>
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Start Using App 🚀</Text>
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.bg },
  container: { padding: 24, paddingTop: 48, alignItems: 'center' },
  appName: { color: THEME.text, fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  subtitle: { color: THEME.textMuted, fontSize: 14, marginTop: 4, marginBottom: 24 },

  progressBar: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  progressDot: {
    width: 80, height: 4, borderRadius: 2, backgroundColor: THEME.bgCard,
  },
  progressDotActive: { backgroundColor: THEME.accent },
  stepLabel: { color: THEME.textMuted, fontSize: 12, marginBottom: 28 },

  stepContainer: { width: '100%', marginBottom: 24 },
  stepTitle: { color: THEME.text, fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  stepDesc: { color: THEME.textMuted, fontSize: 14, marginBottom: 24, lineHeight: 20 },

  fieldLabel: { color: THEME.textMuted, fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: THEME.bgCard,
    borderRadius: THEME.borderRadius,
    padding: 14,
    color: THEME.text,
    fontSize: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2a3a5a',
    justifyContent: 'center',
  },

  dropdown: {
    backgroundColor: THEME.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a3a5a',
    width: '100%',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3a5a',
  },
  dropdownText: { color: THEME.text, fontSize: 15 },

  roleCard: {
    backgroundColor: THEME.bgCard,
    borderRadius: THEME.borderRadius,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardActive: { borderColor: THEME.accent },
  roleIcon: { fontSize: 32 },
  roleTitle: { color: THEME.text, fontSize: 16, fontWeight: 'bold' },
  roleDesc: { color: THEME.textMuted, fontSize: 13, marginTop: 2 },

  buttonRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 },
  backButton: {
    flex: 1, padding: 16, borderRadius: THEME.borderRadius,
    backgroundColor: THEME.bgCard, alignItems: 'center',
  },
  backButtonText: { color: THEME.textMuted, fontSize: 16 },
  nextButton: {
    flex: 2, padding: 16, borderRadius: THEME.borderRadius,
    backgroundColor: THEME.accent, alignItems: 'center',
  },
  nextButtonText: { color: THEME.text, fontSize: 16, fontWeight: 'bold' },
  submitButton: {
    flex: 1, padding: 16, borderRadius: THEME.borderRadius,
    backgroundColor: THEME.danger, alignItems: 'center',
  },
  submitButtonText: { color: THEME.text, fontSize: 16, fontWeight: 'bold' },
});
