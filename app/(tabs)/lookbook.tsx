import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

const CATEGORIES = ["All", "Braids", "Locs", "Cornrows", "Twists", "Men"];

interface StyleItem {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  colors: [string, string];
  icon: string;
  gender: string;
}

const STYLES: StyleItem[] = [
  {
    id: "1",
    name: "Jumbo Box Braids",
    category: "Braids",
    duration: "4-5 hrs",
    price: "$150+",
    colors: ["#2A1F14", "#4A3728"],
    icon: "ribbon",
    gender: "Women",
  },
  {
    id: "2",
    name: "Small Knotless",
    category: "Braids",
    duration: "6-8 hrs",
    price: "$220+",
    colors: ["#1A2A1A", "#2A4A2A"],
    icon: "leaf",
    gender: "Women",
  },
  {
    id: "3",
    name: "Loc Retwist & Style",
    category: "Locs",
    duration: "1-2 hrs",
    price: "$75+",
    colors: ["#2A1A2A", "#4A2A4A"],
    icon: "infinite",
    gender: "Unisex",
  },
  {
    id: "4",
    name: "Faux Locs Goddess",
    category: "Locs",
    duration: "5-7 hrs",
    price: "$200+",
    colors: ["#1A1A2A", "#2A2A4A"],
    icon: "sparkles",
    gender: "Women",
  },
  {
    id: "5",
    name: "Feed-In Cornrows",
    category: "Cornrows",
    duration: "2-3 hrs",
    price: "$100+",
    colors: ["#2A2014", "#4A3524"],
    icon: "git-merge",
    gender: "Unisex",
  },
  {
    id: "6",
    name: "Passion Twists",
    category: "Twists",
    duration: "4-6 hrs",
    price: "$160+",
    colors: ["#14202A", "#243544"],
    icon: "water",
    gender: "Women",
  },
  {
    id: "7",
    name: "Starter Locs",
    category: "Locs",
    duration: "2-3 hrs",
    price: "$120+",
    colors: ["#1F1A14", "#3A2F24"],
    icon: "flash",
    gender: "Unisex",
  },
  {
    id: "8",
    name: "Men's Cornrow Design",
    category: "Men",
    duration: "1-2 hrs",
    price: "$80+",
    colors: ["#141A1F", "#242F3A"],
    icon: "diamond",
    gender: "Men",
  },
  {
    id: "9",
    name: "Senegalese Twists",
    category: "Twists",
    duration: "4-6 hrs",
    price: "$170+",
    colors: ["#201A14", "#3A2F24"],
    icon: "rose",
    gender: "Women",
  },
  {
    id: "10",
    name: "Men's Loc Retwist",
    category: "Men",
    duration: "1 hr",
    price: "$65+",
    colors: ["#1A1F14", "#2A3424"],
    icon: "fitness",
    gender: "Men",
  },
  {
    id: "11",
    name: "Bohemian Braids",
    category: "Braids",
    duration: "5-7 hrs",
    price: "$200+",
    colors: ["#2A1A18", "#4A2A28"],
    icon: "flower",
    gender: "Women",
  },
  {
    id: "12",
    name: "Loc Detox Treatment",
    category: "Locs",
    duration: "1-2 hrs",
    price: "$85+",
    colors: ["#14201A", "#24382A"],
    icon: "medkit",
    gender: "Unisex",
  },
];

function StyleCard({ item, index }: { item: StyleItem; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 80).duration(500)}>
      <Pressable
        style={({ pressed }) => [
          styles.styleCard,
          { transform: [{ scale: pressed ? 0.97 : 1 }] },
        ]}
      >
        <LinearGradient
          colors={item.colors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name={item.icon as any} size={32} color={Colors.light.goldLight} />
          </View>
          <View style={styles.genderTag}>
            <Text style={styles.genderText}>{item.gender}</Text>
          </View>
        </LinearGradient>
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.cardMeta}>
            <Ionicons name="time-outline" size={12} color={Colors.light.warmGray} />
            <Text style={styles.cardDuration}>{item.duration}</Text>
          </View>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LookbookScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? STYLES
      : STYLES.filter((s) => s.category === activeCategory);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : 100,
        }}
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[1]}
      >
        <View style={{ paddingTop: (insets.top || webTopInset) + 16, paddingHorizontal: 24 }}>
          <Text style={styles.title}>Style Lookbook</Text>
          <Text style={styles.subtitle}>
            Explore our signature styles for men & women
          </Text>
        </View>

        <View style={styles.filterWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  activeCategory === cat && styles.filterChipActive,
                ]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setActiveCategory(cat);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeCategory === cat && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {filtered.map((item, i) => (
            <StyleCard key={item.id} item={item} index={i} />
          ))}
        </View>

        {filtered.length === 0 && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyWrap}>
            <Ionicons name="search" size={40} color={Colors.light.warmGray} />
            <Text style={styles.emptyText}>No styles in this category yet</Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.softWhite,
  },
  title: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.light.charcoal,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.light.warmGray,
    marginTop: 4,
  },
  filterWrap: {
    backgroundColor: Colors.light.softWhite,
    paddingVertical: 12,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.15)",
  },
  filterChipActive: {
    backgroundColor: Colors.light.charcoal,
    borderColor: Colors.light.charcoal,
  },
  filterText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.light.warmGray,
  },
  filterTextActive: {
    color: Colors.light.goldLight,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  styleCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.08)",
  },
  cardGradient: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  genderTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  genderText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 10,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.light.charcoal,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  cardDuration: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.light.warmGray,
  },
  cardPrice: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: Colors.light.gold,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.light.warmGray,
  },
});
