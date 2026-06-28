import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/Card";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { getConversations } from "../../services/waynexApi";

export function ChatScreen() {
  const { theme } = useWaynexTheme();
  const { data = [] } = useQuery({ queryKey: ["conversations"], queryFn: getConversations });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={[styles.kicker, { color: theme.primary }]}>WAYNEX CHAT</Text>
          <Text style={[styles.title, { color: theme.text }]}>Trips move better together.</Text>
        </View>

        <Card style={styles.liveShare}>
          <View style={styles.liveLeft}>
            <View style={[styles.liveIcon, { backgroundColor: theme.primary }]}>
              <Ionicons name="location" size={22} color="#06110F" />
            </View>
            <View>
              <Text style={[styles.liveTitle, { color: theme.text }]}>Live location sharing</Text>
              <Text style={[styles.liveCopy, { color: theme.muted }]}>Convoy mode, ETA drift and arrival safety pings.</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.muted} />
        </Card>

        {data.map((chat) => (
          <Card key={chat.id} style={styles.chatRow}>
            <View style={[styles.chatAvatar, { backgroundColor: chat.activeNow ? theme.primary : theme.elevated }]}>
              <Ionicons name={chat.activeNow ? "radio" : "people"} size={20} color={chat.activeNow ? "#06110F" : theme.muted} />
            </View>
            <View style={styles.chatText}>
              <Text style={[styles.chatName, { color: theme.text }]}>{chat.name}</Text>
              <Text style={[styles.chatMessage, { color: theme.muted }]} numberOfLines={2}>
                {chat.lastMessage}
              </Text>
            </View>
            {chat.unread > 0 ? (
              <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                <Text style={styles.badgeText}>{chat.unread}</Text>
              </View>
            ) : null}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: 8,
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#150B05",
    fontSize: 12,
    fontWeight: "900",
  },
  chatAvatar: {
    alignItems: "center",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  chatMessage: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "900",
  },
  chatRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  chatText: {
    flex: 1,
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
  },
  liveCopy: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 3,
  },
  liveIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  liveLeft: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  liveShare: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  liveTitle: {
    fontSize: 17,
    fontWeight: "900",
  },
  safe: {
    flex: 1,
  },
  title: {
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 35,
    marginTop: 6,
  },
});
