import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/src/hooks/use-auth';
import { theme } from '@/src/theme';

import '@/src/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

const ONBOARDING_KEY = '@myfitnesspaw:onboarding_done';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
        setHasOnboarded(value === 'true');
        setOnboardingChecked(true);
      });
    } else if (!loading) {
      setOnboardingChecked(true);
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!loading && onboardingChecked) {
      if (!isAuthenticated) {
        router.replace('/(auth)/login');
      } else if (!hasOnboarded) {
        router.replace('/onboarding');
      }
      SplashScreen.hideAsync();
    }
  }, [loading, isAuthenticated, onboardingChecked, hasOnboarded]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Fonts ready — splash will hide after auth check
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.bg },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding"
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="cat/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="session/live"
              options={{
                headerShown: false,
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="session/manual"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </Stack>
          <StatusBar style="dark" />
        </AuthGate>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
