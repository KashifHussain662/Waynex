import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthScreen, OnboardingScreen } from "../screens/Auth";
import { ChatScreen, HomeScreen } from "../screens/Home";
import { ProductScreen } from "../screens/Product";
import { JournalScreen, ProfileScreen } from "../screens/Profile";
import { SocialScreen } from "../screens/Social";
import { useWaynexTheme } from "../hooks/useWaynexTheme";
import { useAppStore } from "../store/useAppStore";

const ONBOARDING_KEY = "waynex:onboarding-complete";

export type RootTabParamList = {
  Home: undefined;
  Social: undefined;
  Explore: undefined;
  Chat: undefined;
  Journal: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "navigate",
  Social: "planet",
  Explore: "compass",
  Chat: "chatbubbles",
  Journal: "images",
  Profile: "person-circle",
};

export function RootNavigator() {
  const { theme } = useWaynexTheme();
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const session = useAppStore((state) => state.session);

  useEffect(() => {
    async function loadOnboardingState() {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasCompletedOnboarding(value === "true");
      } finally {
        setIsReady(true);
      }
    }

    loadOnboardingState();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasCompletedOnboarding(true);
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={!hasCompletedOnboarding ? "onboarding" : session ? "main" : "auth"}
        initialRouteName={!hasCompletedOnboarding ? "Onboarding" : session ? "MainTabs" : "Auth"}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}
      >
        <Stack.Screen name="Onboarding">
          {() => <OnboardingScreen onComplete={completeOnboarding} />}
        </Stack.Screen>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  const { theme } = useWaynexTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => {
          const iconName = focused
            ? icons[route.name]
            : (`${icons[route.name]}-outline` as keyof typeof Ionicons.glyphMap);

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.tab,
            borderColor: theme.border,
            bottom: Math.max(insets.bottom, 14),
          },
        ],
        sceneStyle: { backgroundColor: theme.background },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Explore" component={ProductScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  tabBar: {
    borderRadius: 8,
    borderWidth: 1,
    elevation: 18,
    height: 64,
    left: 18,
    paddingTop: 9,
    position: "absolute",
    right: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
});
