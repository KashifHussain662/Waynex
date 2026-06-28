import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { useAppStore } from "../../store/useAppStore";

export function ProfileScreen() {
  const { theme, isDark } = useWaynexTheme();
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileTop}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>W</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.name, { color: theme.text }]}>Waynex Traveler</Text>
            <Text style={[styles.meta, { color: theme.muted }]}>Level 7 Explorer • 42 trusted reports</Text>
          </View>
        </View>

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

        {["Saved places", "Emergency profile", "Notification controls", "Offline maps"].map((item) => (
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
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
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
});
