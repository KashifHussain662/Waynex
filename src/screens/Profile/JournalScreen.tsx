import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { profileRepository } from "../../services/repositories";

export function JournalScreen() {
  const { theme } = useWaynexTheme();
  const { data, isLoading } = useQuery({ queryKey: ["profile-journal"], queryFn: profileRepository.getProfile });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#141820", "#432C54", "#FF8A4C"]} style={styles.header}>
          <Text style={styles.kicker}>TRAVEL JOURNAL</Text>
          <Text style={styles.title}>Memories that work offline.</Text>
          <Text style={styles.copy}>Save photos, route notes, places, emergency contacts and expenses locally with sync-ready storage.</Text>
        </LinearGradient>

        {isLoading || !data ? (
          <Card style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </Card>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Travel Albums</Text>
            <View style={styles.memoryGrid}>
              {data.memories.map((memory) => (
                <LinearGradient key={memory.id} colors={memory.gradient} style={styles.album}>
                  <Text style={styles.albumDate}>{memory.date}</Text>
                  <Text style={styles.albumTitle}>{memory.title}</Text>
                  <Text style={styles.albumCopy}>{memory.note}</Text>
                  <Text style={styles.albumMeta}>{memory.place} • {memory.weather} • GPS saved</Text>
                </LinearGradient>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text }]}>Automatic Timeline</Text>
            {data.journal.map((event, index) => (
              <Card key={event.id} style={styles.timelineRow}>
                <View style={[styles.timelineIcon, { backgroundColor: theme.primary }]}>
                  <Ionicons name={event.icon as keyof typeof Ionicons.glyphMap} size={18} color="#06110F" />
                </View>
                <View style={styles.timelineText}>
                  <Text style={[styles.memoryTitle, { color: theme.text }]}>{event.title}</Text>
                  <Text style={[styles.memoryCopy, { color: theme.muted }]}>{event.place} • {event.time}</Text>
                </View>
                <Text style={[styles.timelineIndex, { color: theme.muted }]}>{String(index + 1).padStart(2, "0")}</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  album: {
    borderRadius: 8,
    flexBasis: "48%",
    flexGrow: 1,
    justifyContent: "flex-end",
    minHeight: 220,
    padding: 16,
  },
  albumCopy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 8,
  },
  albumDate: {
    color: "#9EE6D0",
    fontSize: 12,
    fontWeight: "900",
  },
  albumMeta: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10,
  },
  albumTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 25,
    marginTop: 8,
  },
  copy: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 10,
  },
  header: {
    borderRadius: 8,
    minHeight: 280,
    justifyContent: "flex-end",
    padding: 20,
  },
  kicker: {
    color: "#FFD1B8",
    fontSize: 12,
    fontWeight: "900",
  },
  memory: {
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 140,
  },
  memoryCopy: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },
  memoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  memoryTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 18,
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
  timelineIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  timelineIndex: {
    fontSize: 12,
    fontWeight: "900",
  },
  timelineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  timelineText: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginTop: 8,
  },
});
