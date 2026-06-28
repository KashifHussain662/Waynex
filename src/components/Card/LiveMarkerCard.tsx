import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { LiveMarker } from "../../types";
import { Card } from "./Card";

type LiveMarkerCardProps = {
  marker: LiveMarker;
};

export function LiveMarkerCard({ marker }: LiveMarkerCardProps) {
  const { theme } = useWaynexTheme();

  return (
    <Card style={styles.card}>
      <LinearGradient colors={marker.gradient} style={styles.icon}>
        <Ionicons name={marker.icon as keyof typeof Ionicons.glyphMap} size={22} color="#FFFFFF" />
      </LinearGradient>
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.text }]}>{marker.title}</Text>
        <Text style={[styles.copy, { color: theme.muted }]}>{marker.description}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.distance, { color: theme.primary }]}>{marker.distance}</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>{marker.reviews} reviews</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>{marker.comments} comments</Text>
        </View>
      </View>
      <Ionicons name="chevron-up" size={18} color={theme.muted} />
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  card: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  copy: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 5,
  },
  distance: {
    fontSize: 12,
    fontWeight: "900",
  },
  icon: {
    alignItems: "center",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
});
