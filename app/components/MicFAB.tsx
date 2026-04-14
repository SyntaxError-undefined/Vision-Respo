import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MicFABProps {
  onPress: () => void;
  isListening?: boolean;
}

export function MicFAB({ onPress, isListening = false }: MicFABProps) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      const animate = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        );
      const a1 = animate(ring1, 0);
      const a2 = animate(ring2, 400);
      a1.start();
      a2.start();
      return () => {
        a1.stop();
        a2.stop();
      };
    }

    ring1.stopAnimation();
    ring2.stopAnimation();
    ring1.setValue(0);
    ring2.setValue(0);
    return undefined;
  }, [isListening, ring1, ring2]);

  const ringStyle = (anim: Animated.Value) => ({
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
  });

  return (
    <View style={styles.wrapper}>
      {isListening && (
        <>
          <Animated.View style={[styles.ring, ringStyle(ring1)]} />
          <Animated.View style={[styles.ring, ringStyle(ring2)]} />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.icon}>🎙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e90ff',
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  icon: { fontSize: 28 },
});
