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
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/colors";

const ALL_SERVICES = [
  { id: "1", name: "Box Braids", duration: "4-6 hrs", price: 150, icon: "content-cut" },
  { id: "2", name: "Knotless Braids", duration: "5-7 hrs", price: 180, icon: "vector-link" },
  { id: "3", name: "Locs Retwist", duration: "1-2 hrs", price: 75, icon: "hair-dryer" },
  { id: "4", name: "Faux Locs", duration: "5-8 hrs", price: 200, icon: "creation" },
  { id: "5", name: "Cornrows", duration: "1-3 hrs", price: 80, icon: "star-four-points" },
  { id: "6", name: "Passion Twists", duration: "4-6 hrs", price: 160, icon: "shimmer" },
  { id: "7", name: "Senegalese Twists", duration: "4-6 hrs", price: 170, icon: "diamond-stone" },
  { id: "8", name: "Loc Maintenance", duration: "1-2 hrs", price: 65, icon: "wrench" },
  { id: "9", name: "Starter Locs", duration: "2-3 hrs", price: 120, icon: "flare" },
  { id: "10", name: "Loc Detox", duration: "1-2 hrs", price: 85, icon: "water" },
];

const LOCATIONS = [
  { id: "home", label: "At Your Location", desc: "Niya comes to you", icon: "home" },
  { id: "mobile", label: "Mobile (Miami Area)", desc: "Anywhere in Miami-Dade", icon: "car" },
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

function generateDates() {
  const dates: { day: string; date: number; month: string; full: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      full: d.toISOString().split("T")[0],
    });
  }
  return dates;
}

export default function BookScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState(false);

  const dates = generateDates();

  const service = ALL_SERVICES.find((s) => s.id === selectedService);

  const hapticSelect = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleBook = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Missing Info", "Please enter your name and phone number.");
      return;
    }

    const booking = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      service: service?.name,
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = await AsyncStorage.getItem("bookings");
      const bookings = existing ? JSON.parse(existing) : [];
      bookings.push(booking);
      await AsyncStorage.setItem("bookings", JSON.stringify(bookings));
    } catch {}

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setBooked(true);
  };

  const resetBooking = () => {
    setStep(0);
    setSelectedService(null);
    setSelectedLocation(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setPhone("");
    setNotes("");
    setBooked(false);
  };

  if (booked) {
    return (
      <View style={[styles.container, { paddingTop: (insets.top || webTopInset) + 20 }]}>
        <View style={styles.successContainer}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.successIconWrap}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.light.gold} />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successDesc}>
              Your {service?.name} appointment has been requested for{" "}
              {dates.find((d) => d.full === selectedDate)?.month}{" "}
              {dates.find((d) => d.full === selectedDate)?.date} at {selectedTime}.
            </Text>
            <Text style={styles.successNote}>
              Niya will confirm your appointment via text at {phone}.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={resetBooking}
            >
              <Text style={styles.primaryButtonText}>Book Another</Text>
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
          <Text style={styles.headerTitle}>Book Appointment</Text>
          <Text style={styles.headerSub}>
            {step === 0 && "Choose your service"}
            {step === 1 && "Select location"}
            {step === 2 && "Pick date & time"}
            {step === 3 && "Your details"}
          </Text>
        </View>

        <View style={styles.progressRow}>
          {[0, 1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.content}>
            {ALL_SERVICES.map((svc, i) => (
              <Animated.View
                key={svc.id}
                entering={FadeInDown.delay(i * 60).duration(400)}
              >
                <Pressable
                  style={[
                    styles.serviceRow,
                    selectedService === svc.id && styles.serviceRowActive,
                  ]}
                  onPress={() => {
                    hapticSelect();
                    setSelectedService(svc.id);
                  }}
                >
                  <View style={styles.svcIconWrap}>
                    <MaterialCommunityIcons
                      name={svc.icon as any}
                      size={22}
                      color={
                        selectedService === svc.id
                          ? Colors.light.gold
                          : Colors.light.warmGray
                      }
                    />
                  </View>
                  <View style={styles.svcInfo}>
                    <Text style={styles.svcName}>{svc.name}</Text>
                    <Text style={styles.svcDuration}>{svc.duration}</Text>
                  </View>
                  <Text style={styles.svcPrice}>${svc.price}</Text>
                  {selectedService === svc.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={Colors.light.gold}
                    />
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        {step === 1 && (
          <View style={styles.content}>
            {LOCATIONS.map((loc, i) => (
              <Animated.View
                key={loc.id}
                entering={FadeInDown.delay(i * 100).duration(400)}
              >
                <Pressable
                  style={[
                    styles.locationCard,
                    selectedLocation === loc.id && styles.locationCardActive,
                  ]}
                  onPress={() => {
                    hapticSelect();
                    setSelectedLocation(loc.id);
                  }}
                >
                  <View style={styles.locIconWrap}>
                    <Ionicons
                      name={loc.icon as any}
                      size={28}
                      color={
                        selectedLocation === loc.id
                          ? Colors.light.gold
                          : Colors.light.warmGray
                      }
                    />
                  </View>
                  <Text style={styles.locLabel}>{loc.label}</Text>
                  <Text style={styles.locDesc}>{loc.desc}</Text>
                  {selectedLocation === loc.id && (
                    <View style={styles.locCheck}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.content}>
            <Text style={styles.pickLabel}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesRow}
            >
              {dates.map((d) => (
                <Pressable
                  key={d.full}
                  style={[
                    styles.dateCard,
                    selectedDate === d.full && styles.dateCardActive,
                  ]}
                  onPress={() => {
                    hapticSelect();
                    setSelectedDate(d.full);
                  }}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === d.full && styles.dateDayActive,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNum,
                      selectedDate === d.full && styles.dateNumActive,
                    ]}
                  >
                    {d.date}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      selectedDate === d.full && styles.dateMonthActive,
                    ]}
                  >
                    {d.month}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.pickLabel, { marginTop: 24 }]}>
              Select Time
            </Text>
            <View style={styles.timesGrid}>
              {TIME_SLOTS.map((t) => (
                <Pressable
                  key={t}
                  style={[
                    styles.timeChip,
                    selectedTime === t && styles.timeChipActive,
                  ]}
                  onPress={() => {
                    hapticSelect();
                    setSelectedTime(t);
                  }}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === t && styles.timeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.content}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>{service?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price</Text>
                <Text style={styles.summaryValue}>${service?.price}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>
                  {LOCATIONS.find((l) => l.id === selectedLocation)?.label}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {dates.find((d) => d.full === selectedDate)?.month}{" "}
                  {dates.find((d) => d.full === selectedDate)?.date}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
            </View>

            <Text style={[styles.pickLabel, { marginTop: 20 }]}>
              Your Information
            </Text>
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
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Special requests or notes (optional)"
              placeholderTextColor={Colors.light.warmGray}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 },
        ]}
      >
        {step > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setStep(step - 1)}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.light.charcoal} />
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { flex: 1, opacity: pressed ? 0.85 : 1 },
            !(
              (step === 0 && selectedService) ||
              (step === 1 && selectedLocation) ||
              (step === 2 && selectedDate && selectedTime) ||
              step === 3
            ) && styles.buttonDisabled,
          ]}
          onPress={() => {
            if (step === 0 && selectedService) setStep(1);
            else if (step === 1 && selectedLocation) setStep(2);
            else if (step === 2 && selectedDate && selectedTime) setStep(3);
            else if (step === 3) handleBook();
          }}
          disabled={
            !(
              (step === 0 && selectedService) ||
              (step === 1 && selectedLocation) ||
              (step === 2 && selectedDate && selectedTime) ||
              step === 3
            )
          }
        >
          <Text style={styles.primaryButtonText}>
            {step === 3 ? "Confirm Booking" : "Continue"}
          </Text>
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
    marginBottom: 8,
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
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  progressDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(200,169,110,0.15)",
  },
  progressDotActive: {
    backgroundColor: Colors.light.gold,
  },
  content: {
    paddingHorizontal: 20,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: 14,
  },
  serviceRowActive: {
    borderColor: Colors.light.gold,
    backgroundColor: "rgba(200,169,110,0.04)",
  },
  svcIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(200,169,110,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  svcInfo: {
    flex: 1,
  },
  svcName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.charcoal,
  },
  svcDuration: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.light.warmGray,
    marginTop: 2,
  },
  svcPrice: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: Colors.light.gold,
    marginRight: 4,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  locationCardActive: {
    borderColor: Colors.light.gold,
    backgroundColor: "rgba(200,169,110,0.04)",
  },
  locIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(200,169,110,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  locLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 17,
    color: Colors.light.charcoal,
    marginBottom: 4,
  },
  locDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.light.warmGray,
  },
  locCheck: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  pickLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.charcoal,
    marginBottom: 12,
  },
  datesRow: {
    gap: 10,
    paddingRight: 20,
  },
  dateCard: {
    width: 64,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  dateCardActive: {
    backgroundColor: Colors.light.gold,
    borderColor: Colors.light.gold,
  },
  dateDay: {
    fontFamily: "DMSans_500Medium",
    fontSize: 11,
    color: Colors.light.warmGray,
    textTransform: "uppercase",
  },
  dateDayActive: { color: Colors.light.warmBlack },
  dateNum: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: Colors.light.charcoal,
    marginVertical: 4,
  },
  dateNumActive: { color: Colors.light.warmBlack },
  dateMonth: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.light.warmGray,
  },
  dateMonthActive: { color: Colors.light.warmBlack },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  timeChipActive: {
    backgroundColor: Colors.light.gold,
    borderColor: Colors.light.gold,
  },
  timeText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.light.charcoal,
  },
  timeTextActive: {
    color: Colors.light.warmBlack,
    fontFamily: "DMSans_700Bold",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.12)",
  },
  summaryTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 18,
    color: Colors.light.charcoal,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(200,169,110,0.08)",
  },
  summaryLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.light.warmGray,
  },
  summaryValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.light.charcoal,
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    backgroundColor: Colors.light.softWhite,
    borderTopWidth: 1,
    borderTopColor: "rgba(200,169,110,0.1)",
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.15)",
  },
  primaryButton: {
    backgroundColor: Colors.light.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.warmBlack,
  },
  buttonDisabled: {
    opacity: 0.4,
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
