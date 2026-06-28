import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { WaynexPost } from "../../types";
import { compactCount } from "../../utils/format";
import { Card } from "./Card";

type PostCardProps = {
  post: WaynexPost;
  onLike?: (post: WaynexPost) => void;
  onComment?: (post: WaynexPost) => void;
  onShare?: (post: WaynexPost) => void;
  onSave?: (post: WaynexPost) => void;
  onReport?: (post: WaynexPost) => void;
};

export function PostCard({ post, onLike, onComment, onShare, onSave, onReport }: PostCardProps) {
  const { theme } = useWaynexTheme();
  const firstMedia = post.mediaUrls?.[0];

  return (
    <Card style={styles.card}>
      <LinearGradient colors={post.media} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.media}>
        {firstMedia ? <Image source={{ uri: firstMedia }} style={StyleSheet.absoluteFill} contentFit="cover" transition={180} /> : null}
        <View style={styles.mediaTop}>
          <View style={styles.kindPill}>
            <Ionicons name="navigate" size={14} color="#07100F" />
            <Text style={styles.kindText}>{post.kind}</Text>
          </View>
          <Pressable onPress={() => onReport?.(post)} style={styles.visibility}>
            <Text style={styles.visibilityText}>{post.visibility}</Text>
          </Pressable>
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
          <Stat icon={post.liked ? "heart" : "heart-outline"} value={post.likes} active={post.liked} onPress={() => onLike?.(post)} />
          <Stat icon="chatbubble-outline" value={post.comments} onPress={() => onComment?.(post)} />
          <Stat icon="paper-plane-outline" value={post.shares} onPress={() => onShare?.(post)} />
          <Pressable onPress={() => onSave?.(post)} hitSlop={10}>
            <Ionicons name={post.saved ? "bookmark" : "bookmark-outline"} size={19} color={theme.primary} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

function Stat({
  icon,
  value,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  active?: boolean;
  onPress?: () => void;
}) {
  const { theme } = useWaynexTheme();

  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.stat}>
      <Ionicons name={icon} size={17} color={active ? theme.accent : theme.muted} />
      <Text style={[styles.statText, { color: active ? theme.accent : theme.muted }]}>{compactCount(value)}</Text>
    </Pressable>
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
    overflow: "hidden",
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
