import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

type OnboardingScreenProps = {
  onComplete: () => void;
};

const slides = [
  {
    icon: "navigate",
    title: "Navigate with route intelligence",
    copy: "Live traffic, weather, fuel, safety and community updates tuned to your destination.",
  },
  {
    icon: "people",
    title: "Connect with travelers nearby",
    copy: "Share reports, trip chats, live locations, voice notes and trusted road alerts.",
  },
  {
    icon: "images",
    title: "Explore and remember offline",
    copy: "Save places, journals, photos, emergency info and memories for low-signal routes.",
  },
] as const;

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { theme } = useWaynexTheme();
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }

    setIndex((current) => current + 1);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <LinearGradient colors={["#080A0F", "#123E43", "#19C7A8"]} style={styles.hero}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>WAYNEX</Text>
          <Pressable onPress={onComplete} hitSlop={12}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.compassWrap}>
          <View style={styles.orbit}>
            <Ionicons name={slide.icon} size={52} color="#06110F" />
          </View>
        </View>

        <View style={styles.copyBlock}>
          <Text style={styles.tagline}>Navigate. Connect. Explore.</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.copy}>{slide.copy}</Text>
        </View>
      </LinearGradient>

      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <View style={styles.dots}>
          {slides.map((item, dotIndex) => (
            <View
              key={item.title}
              style={[
                styles.dot,
                {
                  backgroundColor: dotIndex === index ? theme.primary : theme.border,
                  width: dotIndex === index ? 26 : 8,
                },
              ]}
            />
          ))}
        </View>
        <Button title={isLast ? "Start exploring" : "Continue"} icon={isLast ? "sparkles" : "arrow-forward"} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: "#9EE6D0",
    fontSize: 13,
    fontWeight: "900",
  },
  compassWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  copy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 23,
    marginTop: 12,
  },
  copyBlock: {
    paddingBottom: 24,
  },
  dot: {
    borderRadius: 8,
    height: 8,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  footer: {
    gap: 20,
    padding: 18,
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    justifyContent: "space-between",
    padding: 22,
  },
  orbit: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 8,
    height: 118,
    justifyContent: "center",
    width: 118,
  },
  safe: {
    flex: 1,
  },
  skip: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    fontWeight: "800",
  },
  tagline: {
    color: "#9EE6D0",
    fontSize: 14,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 35,
    fontWeight: "900",
    lineHeight: 41,
    marginTop: 10,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
