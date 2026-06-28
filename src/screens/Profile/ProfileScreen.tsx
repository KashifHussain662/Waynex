import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { profileRepository } from "../../services/repositories";
import { useAppStore } from "../../store/useAppStore";

export function ProfileScreen() {
  const { theme, isDark } = useWaynexTheme();
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const { data, error, isLoading, refetch } = useQuery({ queryKey: ["profile"], queryFn: profileRepository.getProfile });
  const profile = data?.profile;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading || !profile ? (
          <Card style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </Card>
        ) : (
          <>
            <View style={styles.profileTop}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
                <Text style={[styles.meta, { color: theme.muted }]}>
                  Level {profile.stats.level} Explorer - {profile.stats.reports} trusted reports
                </Text>
                {profile.bio ? <Text style={[styles.bio, { color: theme.muted }]}>{profile.bio}</Text> : null}
              </View>
            </View>

            <View style={styles.statsGrid}>
              {[
                { label: "Trips", value: profile.stats.trips },
                { label: "XP", value: profile.stats.xp },
                { label: "Countries", value: profile.stats.countries },
                { label: "Badges", value: profile.badges.length },
              ].map((item) => (
                <Card key={item.label} style={styles.statCard}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{item.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.muted }]}>{item.label}</Text>
                </Card>
              ))}
            </View>

            <Card style={styles.profileDetails}>
              <Text style={[styles.detailText, { color: theme.text }]}>{profile.country || "Country not set"}</Text>
              <Text style={[styles.detailText, { color: theme.muted }]}>{profile.languages.join(", ") || "Languages not set"}</Text>
              <Text style={[styles.detailText, { color: theme.primary }]}>{profile.badges.join(" - ") || "No badges yet"}</Text>
            </Card>
          </>
        )}

        {error ? (
          <Card style={styles.row}>
            <Text style={[styles.rowText, { color: theme.accent }]}>Profile failed to load</Text>
            <Ionicons name="refresh" size={20} color={theme.primary} onPress={() => refetch()} />
          </Card>
        ) : null}

        <Card style={styles.setting}>
          <View style={styles.settingText}>
            <Ionicons name="moon" size={20} color={theme.primary} />
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>Dark mode</Text>
              <Text style={[styles.settingCopy, { color: theme.muted }]}>Premium low-light navigation UI.</Text>
            </View>
          </View>
          <Switch value={isDark} onValueChange={(value) => setThemeMode(value ? "dark" : "light")} />
        </Card>

        {["Saved places", "Saved posts", "Emergency profile", "Notification controls", "Offline maps", "Recent memories"].map((item) => (
          <Card key={item} style={styles.row}>
            <Text style={[styles.rowText, { color: theme.text }]}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.muted} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderRadius: 8,
    height: 66,
    justifyContent: "center",
    width: 66,
  },
  avatarText: {
    color: "#06110F",
    fontSize: 28,
    fontWeight: "900",
  },
  bio: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 7,
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "800",
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  meta: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: "900",
  },
  profileDetails: {
    gap: 8,
  },
  profileText: {
    flex: 1,
  },
  profileTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowText: {
    fontSize: 16,
    fontWeight: "900",
  },
  safe: {
    flex: 1,
  },
  setting: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingCopy: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  settingText: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  statCard: {
    flex: 1,
    minHeight: 82,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
