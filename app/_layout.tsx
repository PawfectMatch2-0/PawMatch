import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { supabase, authService } from '@/lib/supabase';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { SplashScreen } from 'expo-router';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Listen for auth state changes
  useEffect(() => {
    if (!supabase) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 [Root Layout] Auth state change:', event, session?.user?.email);
      
      // Don't redirect if we're currently on the auth callback route
      // Let the auth-callback.tsx handle the redirect instead
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath.includes('auth-callback')) {
        console.log('🔍 [Root Layout] On auth-callback route, skipping redirect');
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log('🔍 [Root Layout] Processing SIGNED_IN event');
          // Create or update user profile
          await authService.createOrUpdateProfile(session.user);
          
          // Navigate to main app
          console.log('🔍 [Root Layout] Redirecting to main app after successful OAuth');
          router.replace('/(tabs)');
        } catch (error) {
          console.error('❌ [Root Layout] Error handling auth state change:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
    </GestureHandlerRootView>
  );
}