import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

const memories = ["Skardu road notes", "Family stops", "Offline photos", "Receipts"];

export function JournalScreen() {
  const { theme } = useWaynexTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#141820", "#432C54", "#FF8A4C"]} style={styles.header}>
          <Text style={styles.kicker}>TRAVEL JOURNAL</Text>
          <Text style={styles.title}>Memories that work offline.</Text>
          <Text style={styles.copy}>Save photos, route notes, places, emergency contacts and expenses locally with sync-ready storage.</Text>
        </LinearGradient>

        <View style={styles.memoryGrid}>
          {memories.map((memory, index) => (
            <Card key={memory} style={styles.memory}>
              <Ionicons name={index % 2 === 0 ? "images" : "document-text"} size={24} color={theme.primary} />
              <Text style={[styles.memoryTitle, { color: theme.text }]}>{memory}</Text>
              <Text style={[styles.memoryCopy, { color: theme.muted }]}>Available offline</Text>
            </Card>
          ))}
        </View>
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
  safe: {
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
