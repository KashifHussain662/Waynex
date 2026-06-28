import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, PostCard } from "../../components/Card";
import { Input } from "../../components/Input";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { getRouteDashboard } from "../../services/waynexApi";
import { useAppStore } from "../../store/useAppStore";
import { palette } from "../../theme";

export function HomeScreen() {
  const { theme } = useWaynexTheme();
  const destination = useAppStore((state) => state.destination);
  const setDestination = useAppStore((state) => state.setDestination);
  const { data, isLoading } = useQuery({
    queryKey: ["route-dashboard", destination],
    queryFn: getRouteDashboard,
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: theme.primary }]}>WAYNEX</Text>
            <Text style={[styles.title, { color: theme.text }]}>Navigate. Connect. Explore.</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: theme.elevated, borderColor: theme.border }]}>
            <Ionicons name="sparkles" size={20} color={theme.primary} />
          </View>
        </View>

        <Input
          icon="navigate"
          value={destination}
          onChangeText={setDestination}
          placeholder="Where are you heading?"
        />

        <LinearGradient colors={["#0B1018", "#123E43", "#19C7A8"]} style={styles.mapPanel}>
          <View style={styles.mapTop}>
            <Text style={styles.mapLabel}>Live route intelligence</Text>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.routeLine}>
            <View style={styles.routeNode} />
            <View style={styles.routeDash} />
            <View style={[styles.routeNode, styles.routeNodeEnd]} />
          </View>
          <Text style={styles.mapTitle}>Islamabad to {destination}</Text>
          <Text style={styles.mapSub}>Route feed, traffic alerts, fuel, weather and nearby travelers in one place.</Text>
        </LinearGradient>

        {isLoading || !data ? (
          <Card style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </Card>
        ) : (
          <>
            <View style={styles.insightGrid}>
              {data.insights.map((item) => (
                <Card key={item.id} style={styles.insightCard}>
                  <Text
                    style={[
                      styles.insightValue,
                      { color: item.tone === "alert" ? palette.ember : theme.text },
                    ]}
                  >
                    {item.value}
                  </Text>
                  <Text style={[styles.insightLabel, { color: theme.muted }]}>{item.label}</Text>
                </Card>
              ))}
            </View>

            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Route Feed</Text>
              <Text style={[styles.sectionAction, { color: theme.primary }]}>25 km radius</Text>
            </View>
            {data.feed.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 110,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  insightCard: {
    flex: 1,
    minHeight: 92,
  },
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  liveDot: {
    backgroundColor: palette.success,
    borderRadius: 6,
    height: 7,
    width: 7,
  },
  livePill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  loading: {
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  mapLabel: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 13,
    fontWeight: "800",
  },
  mapPanel: {
    borderRadius: 8,
    minHeight: 270,
    overflow: "hidden",
    padding: 18,
  },
  mapSub: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 300,
  },
  mapTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 31,
    marginTop: 28,
  },
  mapTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  routeDash: {
    backgroundColor: "rgba(255,255,255,0.72)",
    flex: 1,
    height: 4,
  },
  routeLine: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 72,
  },
  routeNode: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 18,
    width: 18,
  },
  routeNodeEnd: {
    backgroundColor: palette.ember,
  },
  safe: {
    flex: 1,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  sectionTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 29,
    marginTop: 4,
  },
});
