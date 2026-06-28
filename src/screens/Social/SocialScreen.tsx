import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, PostCard, StoryRail } from "../../components/Card";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { communityService } from "../../services/firebase";
import { socialRepository } from "../../services/repositories";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { WaynexPost } from "../../types";

const socialActions = ["Follow", "Unfollow", "Block", "Report", "Verify", "Mention", "Hashtag", "Repost"];

export function SocialScreen() {
  const { theme } = useWaynexTheme();
  const queryClient = useQueryClient();
  const [postText, setPostText] = useState("");
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [commentPost, setCommentPost] = useState<WaynexPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["social-feed"],
    queryFn: socialRepository.getSocialFeed,
  });
  useRealtimeQuery(["social-feed"], socialRepository.subscribeSocialFeed?.bind(socialRepository));

  const posts = data?.posts ?? [];
  const invalidateFeed = () => queryClient.invalidateQueries({ queryKey: ["social-feed"] });

  const createPost = useMutation({
    mutationFn: () =>
      communityService.createPost({
        text: postText,
        media: media.map((item) => ({
          uri: item.uri,
          kind: item.type === "video" ? "video" : "image",
          contentType: item.mimeType,
          fileName: item.fileName ?? undefined,
        })),
        onUploadProgress: (_, progress) => setUploadProgress(progress.progress),
      }),
    onSuccess: () => {
      setPostText("");
      setMedia([]);
      setUploadProgress(null);
      invalidateFeed();
    },
    onError: () => setUploadProgress(null),
  });

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.82,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });

    if (!result.canceled) {
      setMedia(result.assets);
    }
  };

  const toggleLike = async (post: WaynexPost) => {
    await (post.liked ? communityService.unlikePost(post.id) : communityService.likePost(post.id));
    invalidateFeed();
  };

  const toggleSave = async (post: WaynexPost) => {
    await (post.saved ? communityService.unsavePost(post.id) : communityService.savePost(post.id));
    invalidateFeed();
  };

  const sharePost = async (post: WaynexPost) => {
    await communityService.sharePost(post.id);
    await Share.share({ message: `${post.title}\n\nShared from Waynex.` });
    invalidateFeed();
  };

  const reportPost = async (post: WaynexPost) => {
    await communityService.reportPost(post.id, "other", "Reported from community feed");
  };

  const submitComment = async () => {
    if (!commentPost || !commentText.trim()) {
      return;
    }

    await communityService.comment(commentPost.id, commentText);
    setCommentPost(null);
    setCommentText("");
    invalidateFeed();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={posts}
        keyExtractor={(post) => post.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.primary} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
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
                <Card style={styles.composer}>
                  <TextInput
                    value={postText}
                    onChangeText={setPostText}
                    multiline
                    placeholder="Share a route update, place, weather note or travel memory..."
                    placeholderTextColor={theme.muted}
                    style={[styles.composerInput, { color: theme.text }]}
                  />
                  {media.length ? <Text style={[styles.mediaCount, { color: theme.primary }]}>{media.length} media selected</Text> : null}
                  {uploadProgress !== null ? (
                    <Text style={[styles.mediaCount, { color: theme.primary }]}>Uploading {Math.round(uploadProgress * 100)}%</Text>
                  ) : null}
                  <View style={styles.composerActions}>
                    <Pressable onPress={pickMedia} style={[styles.composerButton, { borderColor: theme.border }]}>
                      <Ionicons name="images" size={17} color={theme.primary} />
                      <Text style={[styles.composerButtonText, { color: theme.text }]}>Media</Text>
                    </Pressable>
                    <Pressable
                      disabled={!postText.trim() || createPost.isPending}
                      onPress={() => createPost.mutate()}
                      style={[styles.postButton, { backgroundColor: theme.primary, opacity: !postText.trim() || createPost.isPending ? 0.55 : 1 }]}
                    >
                      <Ionicons name="send" size={17} color="#06110F" />
                      <Text style={styles.postButtonText}>{createPost.isPending ? "Posting" : "Post"}</Text>
                    </Pressable>
                  </View>
                </Card>

                {commentPost ? (
                  <Card style={styles.commentBox}>
                    <Text style={[styles.commentTitle, { color: theme.text }]}>Reply to post</Text>
                    <TextInput
                      value={commentText}
                      onChangeText={setCommentText}
                      placeholder="Write a comment..."
                      placeholderTextColor={theme.muted}
                      style={[styles.commentInput, { borderColor: theme.border, color: theme.text }]}
                    />
                    <View style={styles.composerActions}>
                      <Pressable onPress={() => setCommentPost(null)}>
                        <Text style={[styles.sectionAction, { color: theme.muted }]}>Cancel</Text>
                      </Pressable>
                      <Pressable onPress={submitComment}>
                        <Text style={[styles.sectionAction, { color: theme.primary }]}>Send</Text>
                      </Pressable>
                    </View>
                  </Card>
                ) : null}

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
                  <Text style={[styles.sectionAction, { color: theme.primary }]}>Live Firebase</Text>
                </View>
                {error ? <Text style={[styles.errorText, { color: theme.accent }]}>Feed could not load. Pull to retry.</Text> : null}
                {!posts.length ? (
                  <Card style={styles.emptyState}>
                    <Ionicons name="trail-sign" size={28} color={theme.primary} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>No community posts yet</Text>
                    <Text style={[styles.emptyCopy, { color: theme.muted }]}>Create the first live travel update for this route.</Text>
                  </Card>
                ) : null}
              </>
            )}
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={toggleLike}
            onComment={setCommentPost}
            onShare={sharePost}
            onSave={toggleSave}
            onReport={reportPost}
          />
        )}
      />
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
  commentBox: {
    gap: 10,
  },
  commentInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "700",
    padding: 12,
  },
  commentTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  composer: {
    gap: 10,
  },
  composerActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  composerButton: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  composerButtonText: {
    fontSize: 13,
    fontWeight: "900",
  },
  composerInput: {
    fontSize: 15,
    fontWeight: "700",
    minHeight: 74,
    textAlignVertical: "top",
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
  emptyCopy: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    minHeight: 150,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "800",
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
    justifyContent: "center",
    minHeight: 120,
  },
  mediaCount: {
    fontSize: 12,
    fontWeight: "900",
  },
  postButton: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postButtonText: {
    color: "#06110F",
    fontSize: 13,
    fontWeight: "900",
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
