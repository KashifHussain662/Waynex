import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useWaynexTheme } from "../../hooks/useWaynexTheme";
import { useAppStore } from "../../store/useAppStore";
import { AuthProvider } from "../../types";

const authOptions: Array<{
  provider: AuthProvider;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { provider: "google", label: "Continue with Google", icon: "logo-google" },
  { provider: "apple", label: "Continue with Apple", icon: "logo-apple" },
  { provider: "phone", label: "Phone OTP", icon: "call" },
];

export function AuthScreen() {
  const { theme } = useWaynexTheme();
  const signIn = useAppStore((state) => state.signIn);
  const isAuthLoading = useAppStore((state) => state.isAuthLoading);

  const handleSignIn = (provider: AuthProvider) => {
    signIn(provider, provider === "email" ? "traveler@waynex.app" : provider);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#080A0F", "#123E43", "#19C7A8"]}
          style={styles.hero}
        >
          <Text style={styles.brand}>WAYNEX ID</Text>
          <Text style={styles.title}>Your passport for smarter travel.</Text>
          <Text style={styles.copy}>
            Secure profile, social graph, trip groups, stories, memories and
            trusted community alerts.
          </Text>
        </LinearGradient>

        <View style={styles.form}>
          <Input
            icon="mail"
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input icon="lock-closed" placeholder="Password" secureTextEntry />
          <Button
            title="Sign in with email"
            icon="log-in"
            onPress={() => handleSignIn("email")}
          />
        </View>

        <View style={styles.providers}>
          {authOptions.map((option) => (
            <Pressable
              key={option.provider}
              onPress={() => handleSignIn(option.provider)}
              style={({ pressed }) => [
                styles.provider,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.74 : 1,
                },
              ]}
            >
              <Ionicons name={option.icon} size={20} color={theme.text} />
              <Text style={[styles.providerText, { color: theme.text }]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          title="Explore as guest"
          icon="compass"
          variant="ghost"
          onPress={() => handleSignIn("guest")}
        />

        {isAuthLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: "#9EE6D0",
    fontSize: 12,
    fontWeight: "900",
  },
  content: {
    gap: 16,
    padding: 18,
    paddingBottom: 44,
  },
  copy: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginTop: 10,
  },
  form: {
    gap: 12,
  },
  hero: {
    borderRadius: 8,
    justifyContent: "flex-end",
    minHeight: 300,
    padding: 20,
  },
  loading: {
    alignItems: "center",
    paddingVertical: 8,
  },
  provider: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  providers: {
    gap: 10,
  },
  providerText: {
    fontSize: 15,
    fontWeight: "800",
  },
  safe: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39,
    marginTop: 8,
  },
});
