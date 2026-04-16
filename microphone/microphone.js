import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import Voice from "@react-native-voice/voice";

export default function VoiceEmergency() {
  const [userLocation, setUserLocation] = useState(null);
  const [listening, setListening] = useState(false);

  // 🔐 Ask permission once
  useEffect(() => {
    requestLocationPermission();

    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // 📍 Request location permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Enable location for emergency alerts");
    }
  };

  // 📍 Get location
  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(location.coords);
      return location.coords;
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  // 🎤 Start listening
  const startListening = async () => {
    try {
      setListening(true);
      await Voice.start("en-US");

      // get location in parallel
      getLocation();
    } catch (e) {
      console.log(e);
    }
  };

  // 🧠 Detect emergency type
  const detectEmergency = (text) => {
    text = text.toLowerCase();

    if (text.includes("fire") || text.includes("smoke")) return "FIRE";
    if (text.includes("flood") || text.includes("water")) return "FLOOD";
    if (text.includes("attack") || text.includes("gun")) return "ATTACK";
    if (text.includes("help") || text.includes("emergency")) return "GENERAL";

    return "UNKNOWN";
  };

  // 🧠 When speech result comes
  const onSpeechResults = (event) => {
    const text = event.value[0];
    console.log("User said:", text);

    const type = detectEmergency(text);

    if (type !== "UNKNOWN") {
      handleEmergency(type);
    } else {
      Alert.alert("Not detected", "Could not detect emergency");
    }

    setListening(false);
  };

  // 🚨 Handle emergency
  const handleEmergency = async (type) => {
    let coords = userLocation;

    // fallback if not ready yet
    if (!coords) {
      coords = await getLocation();
    }

    // 🎤 AI voice feedback
    Speech.speak(`${type} detected. Sending alert.`);

    // 🚨 POPUP ALERT
    Alert.alert(
      "🚨 Emergency Detected",
      `${type} detected at your location.\n\nLatitude: ${coords?.latitude}\nLongitude: ${coords?.longitude}`,
      [
        { text: "Confirm", onPress: () => console.log("Confirmed") },
        { text: "Cancel", style: "cancel" },
      ]
    );

    // 👉 You can send this to backend here
    console.log({
      type,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Voice Assistant</Text>

      <TouchableOpacity style={styles.micButton} onPress={startListening}>
        <Text style={styles.micText}>
          {listening ? "Listening..." : "🎤 Tap to Speak"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontWeight: "bold",
  },
  micButton: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 50,
  },
  micText: {
    color: "white",
    fontSize: 16,
  },
});