import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Card, RecommendationCard } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { exploreRepository } from "../../services/repositories";
import { palette } from "../../theme";

const modules = [
  { icon: "bed", title: "Premium Stays", copy: "Hotels ranked by route fit, parking, family safety and late check-in." },
  { icon: "restaurant", title: "Road Food", copy: "Clean stops, local favorites, prayer spaces, washrooms and card support." },
  { icon: "sparkles", title: "AI Travel Assistant", copy: "Ask for route plans, weather windows, fuel stops and emergency options." },
  { icon: "shield-checkmark", title: "Emergency Layer", copy: "Hospitals, rescue, mechanics, police and trusted community reports." },
] as const;

export function ProductScreen() {
  const { theme } = useWaynexTheme();
  const { data, isLoading } = useQuery({ queryKey: ["explore"], queryFn: exploreRepository.getExplore });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#101820", "#2C5364", "#7CCBFF"]} style={styles.hero}>
          <Text style={styles.heroKicker}>EXPLORE OS</Text>
          <Text style={styles.heroTitle}>A premium travel layer for every kilometer.</Text>
          <Text style={styles.heroCopy}>
            Discover places, warnings, memories and stays through a route-aware interface built for travelers.
          </Text>
          <View style={styles.heroActions}>
            <Button title="Plan with AI" icon="sparkles" />
            <Button title="Scan place" icon="camera" variant="ghost" />
          </View>
        </LinearGradient>

        {isLoading || !data ? (
          <Card style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </Card>
        ) : (
          <>
            <View style={styles.grid}>
              {data.collections.map((item) => (
                <LinearGradient key={item.id} colors={item.gradient} style={styles.collection}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="#FFFFFF" />
                  <Text style={styles.collectionTitle}>{item.title}</Text>
                  <Text style={styles.collectionCopy}>{item.subtitle}</Text>
                </LinearGradient>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>AI Picks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRail}>
              {data.recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.grid}>
          {modules.map((item) => (
            <Card key={item.title} style={styles.module}>
              <View style={[styles.iconWrap, { backgroundColor: theme.elevated }]}>
                <Ionicons name={item.icon} size={22} color={theme.primary} />
              </View>
              <Text style={[styles.moduleTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.moduleCopy, { color: theme.muted }]}>{item.copy}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.assistant}>
          <View>
            <Text style={[styles.assistantTitle, { color: theme.text }]}>Waynex Assistant</Text>
            <Text style={[styles.assistantCopy, { color: theme.muted }]}>
              Find a scenic stop before sunset with fuel nearby and low traffic.
            </Text>
          </View>
          <View style={[styles.voiceButton, { backgroundColor: palette.ember }]}>
            <Ionicons name="mic" size={22} color="#150B05" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  assistant: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  assistantCopy: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 8,
  },
  assistantTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  collection: {
    borderRadius: 8,
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 190,
    justifyContent: "flex-end",
    padding: 16,
  },
  collectionCopy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8,
  },
  collectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
    marginTop: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  hero: {
    borderRadius: 8,
    minHeight: 300,
    padding: 20,
    justifyContent: "flex-end",
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  heroCopy: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    marginTop: 10,
  },
  heroKicker: {
    color: "#9EE6D0",
    fontSize: 12,
    fontWeight: "900",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 37,
    marginTop: 8,
  },
  horizontalRail: {
    gap: 10,
    paddingRight: 18,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  module: {
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 184,
  },
  moduleCopy: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 8,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 14,
  },
  loading: {
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  safe: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  voiceButton: {
    alignItems: "center",
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
});
