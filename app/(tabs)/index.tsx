import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const SERVICES = [
  { icon: "content-cut" as const, label: "Box Braids", price: "From $150" },
  { icon: "vector-link" as const, label: "Knotless Braids", price: "From $180" },
  { icon: "hair-dryer" as const, label: "Locs Retwist", price: "From $75" },
  { icon: "creation" as const, label: "Faux Locs", price: "From $200" },
  { icon: "star-four-points" as const, label: "Cornrows", price: "From $80" },
  { icon: "shimmer" as const, label: "Passion Twists", price: "From $160" },
];

function PulsingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: Colors.light.gold,
          marginHorizontal: 3,
        },
        style,
      ]}
    />
  );
}

function ServiceCard({
  icon,
  label,
  price,
  index,
}: {
  icon: string;
  label: string;
  price: string;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 100).duration(500)}>
      <Pressable
        style={({ pressed }) => [
          styles.serviceCard,
          { transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
        onPress={() => router.push("/(tabs)/book")}
      >
        <View style={styles.serviceIconWrap}>
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={Colors.light.gold}
          />
        </View>
        <Text style={styles.serviceLabel}>{label}</Text>
        <Text style={styles.servicePrice}>{price}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : 100,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <LinearGradient
          colors={["#0D0D0D", "#1A1A1A", "#2A2218"]}
          style={[styles.hero, { paddingTop: (insets.top || webTopInset) + 20 }]}
        >
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroWelcome}>Welcome to</Text>
              <Text style={styles.heroTitle}>Styles By Niya</Text>
            </View>
            <Pressable
              onPress={() => Linking.openURL("tel:3054092556")}
              style={styles.phoneButton}
            >
              <Ionicons name="call" size={20} color={Colors.light.gold} />
            </Pressable>
          </View>

          <View style={styles.heroTaglineRow}>
            <PulsingDot delay={0} />
            <PulsingDot delay={300} />
            <PulsingDot delay={600} />
            <Text style={styles.heroTagline}>
              {"  "}Premium Braids, Locs & Protective Styles
            </Text>
          </View>

          <Text style={styles.heroSubtag}>
            Miami, FL 33147 {"  "}|{"  "} Mobile & At-Home Service
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.heroBookButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.push("/(tabs)/book")}
          >
            <Text style={styles.heroBookText}>Book Your Appointment</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.light.warmBlack} />
          </Pressable>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>500+</Text>
              <Text style={styles.heroStatLabel}>Happy Clients</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>8+</Text>
              <Text style={styles.heroStatLabel}>Years Exp</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>5.0</Text>
              <Text style={styles.heroStatLabel}>Rating</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Pressable onPress={() => router.push("/(tabs)/book")}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.label} {...s} index={i} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Niya?</Text>
          <View style={styles.whyCards}>
            <WhyCard
              icon="location"
              title="We Come to You"
              desc="Mobile styling at your home or any location in Miami"
              index={0}
            />
            <WhyCard
              icon="shield-checkmark"
              title="Expert Care"
              desc="Specializing in natural hair, braids & protective styles"
              index={1}
            />
            <WhyCard
              icon="heart"
              title="For Everyone"
              desc="Beautiful styles for men & women of all ages"
              index={2}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <View style={styles.contactCard}>
            <Pressable
              style={styles.contactRow}
              onPress={() => Linking.openURL("tel:3054092556")}
            >
              <View style={styles.contactIconWrap}>
                <Ionicons name="call" size={18} color={Colors.light.gold} />
              </View>
              <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>305-409-2556</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.light.warmGray}
                style={{ marginLeft: "auto" }}
              />
            </Pressable>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <View style={styles.contactIconWrap}>
                <Ionicons name="location" size={18} color={Colors.light.gold} />
              </View>
              <View>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>Miami, FL 33147</Text>
              </View>
            </View>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <View style={styles.contactIconWrap}>
                <Feather name="clock" size={18} color={Colors.light.gold} />
              </View>
              <View>
                <Text style={styles.contactLabel}>Hours</Text>
                <Text style={styles.contactValue}>Mon-Sat: 9AM - 7PM</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function WhyCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(300 + index * 150).duration(500)}>
      <View style={styles.whyCard}>
        <View style={styles.whyIconWrap}>
          <Ionicons name={icon as any} size={22} color={Colors.light.gold} />
        </View>
        <Text style={styles.whyTitle}>{title}</Text>
        <Text style={styles.whyDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.softWhite,
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroWelcome: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.light.goldLight,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  heroTaglineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  heroTagline: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
  },
  heroSubtag: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 8,
  },
  heroBookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.gold,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginTop: 24,
    gap: 8,
  },
  heroBookText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: Colors.light.warmBlack,
  },
  heroStatsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 20,
  },
  heroStat: {
    alignItems: "center",
  },
  heroStatNum: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: Colors.light.gold,
  },
  heroStatLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 22,
    color: Colors.light.charcoal,
    marginBottom: 16,
  },
  seeAll: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.light.gold,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.12)",
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(200,169,110,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  serviceLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.light.charcoal,
    marginBottom: 4,
  },
  servicePrice: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.light.warmGray,
  },
  whyCards: {
    gap: 12,
  },
  whyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.12)",
  },
  whyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(200,169,110,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  whyTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 16,
    color: Colors.light.charcoal,
    marginBottom: 4,
  },
  whyDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.light.warmGray,
    lineHeight: 19,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.12)",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(200,169,110,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.light.warmGray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactValue: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.light.charcoal,
    marginTop: 2,
  },
  contactDivider: {
    height: 1,
    backgroundColor: "rgba(200,169,110,0.1)",
    marginHorizontal: 16,
  },
});
