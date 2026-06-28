import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { WaynexPost } from "../../types";
import { compactCount } from "../../utils/format";
import { Card } from "./Card";

type PostCardProps = {
  post: WaynexPost;
};

export function PostCard({ post }: PostCardProps) {
  const { theme } = useWaynexTheme();

  return (
    <Card style={styles.card}>
      <LinearGradient colors={post.media} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.media}>
        <View style={styles.mediaTop}>
          <View style={styles.kindPill}>
            <Ionicons name="navigate" size={14} color="#07100F" />
            <Text style={styles.kindText}>{post.kind}</Text>
          </View>
          <View style={styles.visibility}>
            <Text style={styles.visibilityText}>{post.visibility}</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.text }]}>{post.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: theme.muted }]}>{post.place}</Text>
          <Text style={[styles.dot, { color: theme.muted }]}>•</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>{post.distance}</Text>
          <Text style={[styles.dot, { color: theme.muted }]}>•</Text>
          <Text style={[styles.meta, { color: theme.muted }]}>{post.timeAgo}</Text>
        </View>
        <View style={styles.actions}>
          <Stat icon="heart" value={post.likes} />
          <Stat icon="chatbubble" value={post.comments} />
          <Stat icon="paper-plane" value={post.shares} />
          <Ionicons name={post.saved ? "bookmark" : "bookmark-outline"} size={19} color={theme.primary} />
        </View>
      </View>
    </Card>
  );
}

function Stat({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: number }) {
  const { theme } = useWaynexTheme();

  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={17} color={theme.muted} />
      <Text style={[styles.statText, { color: theme.muted }]}>{compactCount(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    marginTop: 16,
  },
  body: {
    paddingTop: 14,
  },
  card: {
    padding: 0,
  },
  dot: {
    fontSize: 13,
  },
  kindPill: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  kindText: {
    color: "#07100F",
    fontSize: 12,
    fontWeight: "900",
  },
  media: {
    aspectRatio: 1.95,
    justifyContent: "flex-start",
    padding: 12,
  },
  mediaTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontSize: 13,
    fontWeight: "600",
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 8,
  },
  stat: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  statText: {
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23,
  },
  visibility: {
    backgroundColor: "rgba(8,10,15,0.5)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  visibilityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
