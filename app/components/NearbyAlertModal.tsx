import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { INCIDENTS } from '../constants/incidents';
import { THEME } from '../constants/theme';
import { NearbyAlert } from '../types/index';

interface NearbyAlertModalProps {
  alert: NearbyAlert | null;
  visible: boolean;
  onConfirm: (incidentId: string) => void;
  onDeny: (incidentId: string) => void;
  onDismiss: () => void;
}

export function NearbyAlertModal({
  alert,
  visible,
  onConfirm,
  onDeny,
  onDismiss,
}: NearbyAlertModalProps) {
  const translateY = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(320);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [translateY, visible]);

  if (!alert) {
    return null;
  }

  const incident = INCIDENTS[alert.type];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
          <Text style={styles.icon}>{incident.icon}</Text>
          <Text style={styles.title}>Emergency Reported Nearby</Text>
          <Text style={styles.meta}>
            {incident.label} • {alert.venue} • {alert.floor}
          </Text>
          <Text style={styles.confirmations}>
            {alert.confirmationCount} people have confirmed this
          </Text>
          <Text style={styles.question}>Are you witnessing this?</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => onConfirm(alert.incidentId)}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.denyButton]}
              onPress={() => onDeny(alert.incidentId)}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  card: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  meta: {
    color: THEME.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  confirmations: {
    color: '#f97316',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  question: {
    color: THEME.text,
    fontSize: 16,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#22c55e',
  },
  denyButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
