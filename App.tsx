import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from './app/constants/theme';
import { useProfile } from './app/hooks/useProfile';
import { OnboardingScreen } from './app/screens/OnboardingScreen';
import { HomeScreen } from './app/screens/HomeScreen';
import { UserProfile, IncidentType } from './app/types/index';

export default function App() {
  const { profile, isLoading, clearProfile } = useProfile();
  const [completedProfile, setCompletedProfile] = useState<UserProfile | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);

  useEffect(() => {
    if (profile) setCompletedProfile(profile);
  }, [profile]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: THEME.textMuted }}>Loading...</Text>
      </View>
    );
  }

  if (!completedProfile) {
    return (
      <OnboardingScreen
        onComplete={(savedProfile: UserProfile) => setCompletedProfile(savedProfile)}
      />
    );
  }

  // Placeholder for DynamicForm — Section 5
  if (selectedIncident) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>📋 {selectedIncident.toUpperCase()} Form</Text>
        <Text style={styles.sub}>DynamicForm coming in Section 5</Text>
        <Text
          style={[styles.sub, { color: THEME.accent, marginTop: 20 }]}
          onPress={() => setSelectedIncident(null)}
        >
          ← Back to Home
        </Text>
      </View>
    );
  }

  return (
    <HomeScreen
      onSelectIncident={(type) => setSelectedIncident(type)}
      onLogout={async () => {
        await clearProfile();
        setCompletedProfile(null);
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: THEME.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { color: THEME.text, fontSize: 22, fontWeight: 'bold' },
  sub: { color: THEME.textMuted, fontSize: 14, marginTop: 8 },
});
