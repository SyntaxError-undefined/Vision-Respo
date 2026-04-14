import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, StatusBar, TouchableOpacity, Alert
} from 'react-native';
import { THEME } from '../constants/theme';
import { INCIDENTS } from '../constants/incidents';
import { SOSButton } from '../components/SOSButton';
import { MicFAB } from '../components/MicFAB';
import { IncidentCard } from '../components/IncidentCard';
import { NearbyAlertModal } from '../components/NearbyAlertModal';
import { useProfile } from '../hooks/useProfile';
import { useNearbyAlerts } from '../hooks/useNearbyAlerts';
import { IncidentType } from '../types/index';

interface HomeScreenProps {
  onSelectIncident: (type: IncidentType) => void;
  onLogout: () => void;
}

export function HomeScreen({ onSelectIncident, onLogout }: HomeScreenProps) {
  const { profile } = useProfile();
  const { alerts, confirmAlert, denyAlert } = useNearbyAlerts(profile?.venueId ?? null);
  const [micListening, setMicListening] = useState(false);
  const [activeAlert, setActiveAlert] = useState(alerts[0] ?? null);
  const [modalVisible, setModalVisible] = useState(false);

  // Show modal when new alert arrives
  React.useEffect(() => {
    if (alerts.length > 0) {
      setActiveAlert(alerts[0]);
      setModalVisible(true);
    }
  }, [alerts]);

  const handleSOS = () => {
    Alert.alert(
      '🚨 SOS Alert',
      'This will immediately alert all staff and emergency services at your venue. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'SEND SOS',
          style: 'destructive',
          onPress: () => {
            Alert.alert('SOS Sent', 'Emergency services and staff have been notified.');
          },
        },
      ]
    );
  };

  const handleMic = () => {
    setMicListening(prev => !prev);
    if (!micListening) {
      Alert.alert('Voice Report', 'Voice reporting coming soon. Use the incident buttons for now.');
      setTimeout(() => setMicListening(false), 2000);
    }
  };

  const largeIncidents: IncidentType[] = ['fire', 'attack', 'medical', 'natural_disaster', 'accident', 'hazard'];
  const smallIncidents: IncidentType[] = ['safety', 'other'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🚨</Text>
          <Text style={styles.headerTitle}>VISION RESPONSE</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Venue info bar */}
      <View style={styles.venueBadge}>
        <Text style={styles.venueText}>
          📍 {profile?.venue ?? 'Unknown Venue'}  ·  Floor {profile?.floor}  ·  Room {profile?.roomNo}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SOS Button */}
        <View style={styles.sosWrapper}>
          <SOSButton onPress={handleSOS} isActive={true} />
          <Text style={styles.sosHint}>Tap for immediate emergency alert</Text>
        </View>

        {/* Large incident grid — 2 columns */}
        <Text style={styles.sectionLabel}>REPORT AN INCIDENT</Text>
        <View style={styles.grid}>
          {largeIncidents.map(type => (
            <View key={type} style={styles.gridItem}>
              <IncidentCard
                config={INCIDENTS[type]}
                incidentType={type}
                onPress={onSelectIncident}
                size="large"
              />
            </View>
          ))}
        </View>

        {/* Small incidents row */}
        <View style={styles.smallRow}>
          {smallIncidents.map(type => (
            <View key={type} style={styles.smallItem}>
              <IncidentCard
                config={INCIDENTS[type]}
                incidentType={type}
                onPress={onSelectIncident}
                size="small"
              />
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mic FAB — fixed bottom center */}
      <View style={styles.micWrapper}>
        <MicFAB onPress={handleMic} isListening={micListening} />
        <Text style={styles.micHint}>
          {micListening ? 'Listening...' : 'Voice Report'}
        </Text>
      </View>

      {/* Nearby Alert Modal */}
      <NearbyAlertModal
        alert={activeAlert}
        visible={modalVisible}
        onConfirm={(id) => {
          confirmAlert(id, profile?.userId ?? 'unknown');
          setModalVisible(false);
        }}
        onDeny={(id) => {
          denyAlert(id);
          setModalVisible(false);
        }}
        onDismiss={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2a4a',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { fontSize: 18 },
  headerTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  logoutBtn: { padding: 6 },
  logoutText: { fontSize: 20 },

  venueBadge: {
    backgroundColor: THEME.bgCard,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2a4a',
  },
  venueText: { color: THEME.textMuted, fontSize: 12 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  sosWrapper: { alignItems: 'center', marginVertical: 24 },
  sosHint: { color: THEME.textMuted, fontSize: 12, marginTop: 10 },

  sectionLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  gridItem: { width: '48.5%' },

  smallRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallItem: { flex: 1 },

  micWrapper: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    alignItems: 'center',
  },
  micHint: {
    color: THEME.textMuted,
    fontSize: 11,
    marginTop: 6,
  },
});
