import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, PostCard, StoryRail } from "../../components/Card";
import { socialRepository } from "../../services/repositories";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";

const socialActions = ["Follow", "Unfollow", "Block", "Report", "Verify", "Mention", "Hashtag", "Repost"];

export function SocialScreen() {
  const { theme } = useWaynexTheme();
  const { data, isLoading } = useQuery({ queryKey: ["social-feed"], queryFn: socialRepository.getSocialFeed });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#080A0F", "#432C54", "#9D8CFF"]} style={styles.hero}>
          <Text style={styles.kicker}>TRAVEL SOCIAL</Text>
          <Text style={styles.title}>A trusted network for people on the move.</Text>
          <Text style={styles.copy}>Stories, route posts, reposts, saves, mentions and verified traveler profiles in one premium feed.</Text>
        </LinearGradient>

        {isLoading || !data ? (
          <Card style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </Card>
        ) : (
          <>
            <StoryRail stories={data.stories} />
            <View style={styles.actionGrid}>
              {socialActions.map((action) => (
                <View key={action} style={[styles.actionChip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <Ionicons name={action === "Report" ? "flag" : "people"} size={14} color={theme.primary} />
                  <Text style={[styles.actionText, { color: theme.text }]}>{action}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Community Feed</Text>
              <Text style={[styles.sectionAction, { color: theme.primary }]}>Public + private</Text>
            </View>
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionChip: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    gap: 14,
    padding: 18,
    paddingBottom: 110,
  },
  copy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 10,
  },
  hero: {
    borderRadius: 8,
    justifyContent: "flex-end",
    minHeight: 280,
    padding: 20,
  },
  kicker: {
    color: "#DCD6FF",
    fontSize: 12,
    fontWeight: "900",
  },
  loading: {
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  safe: {
    flex: 1,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: "900",
  },
  sectionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginTop: 8,
  },
});
