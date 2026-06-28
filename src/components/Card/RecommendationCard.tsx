import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { RouteRecommendation } from "../../types";
import { Card } from "./Card";

type RecommendationCardProps = {
  recommendation: RouteRecommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { theme } = useWaynexTheme();

  return (
    <Card style={styles.card}>
      <View style={[styles.badge, { backgroundColor: theme.primary }]}>
        <Ionicons name="sparkles" size={16} color="#06110F" />
        <Text style={styles.badgeText}>{recommendation.mode}</Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{recommendation.title}</Text>
      <Text style={[styles.copy, { color: theme.muted }]}>{recommendation.reason}</Text>
      <Text style={[styles.impact, { color: theme.accent }]}>{recommendation.impact}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  badgeText: {
    color: "#06110F",
    fontSize: 12,
    fontWeight: "900",
  },
  card: {
    width: 260,
  },
  copy: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 8,
  },
  impact: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
    marginTop: 12,
  },
});
