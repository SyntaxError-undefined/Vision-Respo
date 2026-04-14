import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../constants/theme';
import { IncidentConfig, IncidentType } from '../types/index';

interface IncidentCardProps {
  config: IncidentConfig;
  incidentType: IncidentType;
  onPress: (type: IncidentType) => void;
  size?: 'large' | 'small';
}

export function IncidentCard({
  config,
  incidentType,
  onPress,
  size = 'large',
}: IncidentCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isLarge = size === 'large';

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(incidentType);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View
        style={[
          styles.card,
          isLarge ? styles.largeCard : styles.smallCard,
          isLarge ? { backgroundColor: config.color, borderColor: config.glowColor } : null,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {isLarge && <View style={styles.overlay} />}
        <View style={[styles.content, isLarge ? styles.largeContent : styles.smallContent]}>
          <Text style={isLarge ? styles.largeIcon : styles.smallIcon}>{config.icon}</Text>
          <Text
            style={[
              isLarge ? styles.largeLabel : styles.smallLabel,
              !isLarge && { color: THEME.text },
            ]}
          >
            {config.label}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  largeCard: {
    width: 320,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 8,
  },
  smallCard: {
    width: 320,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1a2a4a',
    marginBottom: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  largeContent: {
    justifyContent: 'space-between',
    padding: 14,
  },
  smallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  largeIcon: {
    fontSize: 32,
    alignSelf: 'flex-start',
  },
  smallIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  largeLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
