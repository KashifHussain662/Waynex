import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { Story } from "../../types";

type StoryRailProps = {
  stories: Story[];
};

export function StoryRail({ stories }: StoryRailProps) {
  const { theme } = useWaynexTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
      {stories.map((story) => (
        <View key={story.id} style={styles.item}>
          <LinearGradient colors={story.gradient} style={styles.avatar}>
            <Text style={styles.initial}>{story.author.name.slice(0, 1)}</Text>
          </LinearGradient>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {story.author.name.split(" ")[0]}
          </Text>
          <Text style={[styles.meta, { color: theme.muted }]} numberOfLines={1}>
            {story.location} • {story.expiresIn}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderRadius: 8,
    height: 70,
    justifyContent: "center",
    width: 70,
  },
  initial: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  item: {
    width: 84,
  },
  meta: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },
  rail: {
    gap: 12,
    paddingRight: 18,
  },
});
