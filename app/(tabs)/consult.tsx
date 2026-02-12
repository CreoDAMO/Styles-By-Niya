import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";

const STYLE_INTERESTS = [
  "Box Braids",
  "Knotless Braids",
  "Locs",
  "Faux Locs",
  "Cornrows",
  "Passion Twists",
  "Senegalese Twists",
  "Loc Retwist",
  "Starter Locs",
  "Other",
];

const HAIR_TYPES = [
  "3A - Loose Curls",
  "3B - Springy Curls",
  "3C - Tight Curls",
  "4A - Coily",
  "4B - Z-Pattern",
  "4C - Tight Coils",
  "Locs",
  "Not Sure",
];

const HAIR_LENGTHS = ["Short (< 4 in)", "Medium (4-8 in)", "Long (8-12 in)", "Extra Long (12+ in)"];

export default function ConsultScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [hairType, setHairType] = useState("");
  const [hairLength, setHairLength] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleStyle = useCallback(
    (style: string) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setSelectedStyles((prev) =>
        prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
      );
    },
    []
  );

  const pickImage = async () => {
    if (photos.length >= 3) {
      Alert.alert("Limit Reached", "You can upload up to 3 photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing Info", "Please enter your name and phone number.");
      return;
    }
    if (selectedStyles.length === 0) {
      Alert.alert("Select a Style", "Please select at least one style you're interested in.");
      return;
    }

    const consult = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      phone: phone.trim(),
      styles: selectedStyles,
      hairType,
      hairLength,
      message: message.trim(),
      photoCount: photos.length,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("consultations");
      const consults = existing ? JSON.parse(existing) : [];
      consults.push(consult);
      await AsyncStorage.setItem("consultations", JSON.stringify(consults));
    } catch {}

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setSelectedStyles([]);
    setHairType("");
    setHairLength("");
    setMessage("");
    setPhotos([]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: (insets.top || webTopInset) + 20 }]}>
        <View style={styles.successContainer}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.successIconWrap}>
              <Ionicons name="chatbubbles" size={56} color={Colors.light.gold} />
            </View>
            <Text style={styles.successTitle}>Consultation Requested!</Text>
            <Text style={styles.successDesc}>
              Niya will review your style preferences and reach out within 24
              hours to schedule your virtual consultation.
            </Text>
            <Text style={styles.successNote}>
              You'll receive a text at {phone}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={resetForm}
            >
              <Text style={styles.primaryButtonText}>Submit Another</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: (insets.top || webTopInset) + 16,
          paddingBottom: Platform.OS === "web" ? 34 : 120,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Virtual Consult</Text>
          <Text style={styles.headerSub}>
            Tell us about your dream style and we'll help bring it to life
          </Text>
        </View>

        <LinearGradient
          colors={["rgba(200,169,110,0.08)", "rgba(200,169,110,0.02)"]}
          style={styles.infoBanner}
        >
          <Feather name="video" size={20} color={Colors.light.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoDesc}>
              Submit your preferences below. Niya will review and schedule a
              FaceTime or video call to discuss your style, pricing, and timing.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Your Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor={Colors.light.warmGray}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={Colors.light.warmGray}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Style Interests
          </Text>
          <Text style={styles.sectionHint}>Select all that apply</Text>
          <View style={styles.chipGrid}>
            {STYLE_INTERESTS.map((style) => (
              <Pressable
                key={style}
                style={[
                  styles.chip,
                  selectedStyles.includes(style) && styles.chipActive,
                ]}
                onPress={() => toggleStyle(style)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStyles.includes(style) && styles.chipTextActive,
                  ]}
                >
                  {style}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Hair Type
          </Text>
          <View style={styles.chipGrid}>
            {HAIR_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  hairType === type && styles.chipActive,
                ]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setHairType(type);
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    hairType === type && styles.chipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Hair Length
          </Text>
          <View style={styles.chipGrid}>
            {HAIR_LENGTHS.map((len) => (
              <Pressable
                key={len}
                style={[
                  styles.chip,
                  hairLength === len && styles.chipActive,
                ]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setHairLength(len);
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    hairLength === len && styles.chipTextActive,
                  ]}
                >
                  {len}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Inspiration Photos
          </Text>
          <Text style={styles.sectionHint}>Upload up to 3 reference photos</Text>
          <View style={styles.photosRow}>
            {photos.map((uri, i) => (
              <View key={i} style={styles.photoWrap}>
                <Image source={{ uri }} style={styles.photo} />
                <Pressable
                  style={styles.photoRemove}
                  onPress={() => removePhoto(i)}
                >
                  <Ionicons name="close" size={14} color="#fff" />
                </Pressable>
              </View>
            ))}
            {photos.length < 3 && (
              <Pressable style={styles.addPhotoBtn} onPress={pickImage}>
                <Ionicons name="camera" size={24} color={Colors.light.warmGray} />
                <Text style={styles.addPhotoText}>Add</Text>
              </Pressable>
            )}
          </View>

          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
            Additional Details
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your desired look, any concerns, allergies, or preferences..."
            placeholderTextColor={Colors.light.warmGray}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { flex: 1, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={handleSubmit}
        >
          <Feather name="send" size={18} color={Colors.light.warmBlack} style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Request Consultation</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.softWhite,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.light.charcoal,
  },
  headerSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.light.warmGray,
    marginTop: 4,
    lineHeight: 20,
  },
  infoBanner: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.light.charcoal,
    marginBottom: 4,
  },
  infoDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.light.warmGray,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.charcoal,
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.light.warmGray,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.light.charcoal,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.12)",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.15)",
  },
  chipActive: {
    backgroundColor: Colors.light.charcoal,
    borderColor: Colors.light.charcoal,
  },
  chipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.light.warmGray,
  },
  chipTextActive: {
    color: Colors.light.goldLight,
  },
  photosRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  photoWrap: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  photo: {
    width: 80,
    height: 80,
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(200,169,110,0.3)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addPhotoText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: Colors.light.warmGray,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.light.softWhite,
    borderTopWidth: 1,
    borderTopColor: "rgba(200,169,110,0.1)",
  },
  primaryButton: {
    backgroundColor: Colors.light.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.warmBlack,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  successIconWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.light.charcoal,
    textAlign: "center",
    marginBottom: 12,
  },
  successDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: Colors.light.warmGray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  successNote: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.light.gold,
    textAlign: "center",
    marginBottom: 28,
  },
});
