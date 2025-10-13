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
    console.log('🔍 [Auth] Auth state listener TEMPORARILY DISABLED to debug loops');
    return; // Early return to disable auth listener
    
    if (!supabase) {
      console.log('🔍 [Auth] Supabase not configured, skipping auth listener');
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 [Auth] State change:', event, 'User:', session?.user?.email);
      // Pathname check removed due to type issues
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          console.log('✅ [Auth] User signed in, creating profile...');
          
          // Create or update user profile
          const profile = await authService.createOrUpdateProfile(session.user);
          console.log('✅ [Auth] Profile created:', profile?.email);
          
          // Always redirect to main app after successful sign in
          console.log('� [Auth] Redirecting to main app after successful OAuth');
          
          // Add a small delay to ensure the auth state is fully processed
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 100);
        } catch (error) {
          console.error('❌ [Auth] Error handling auth state change:', error);
          // Don't redirect on error - let user stay where they are or manually retry
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 [Auth] User signed out');
        router.replace('/');
      } else {
        console.log('ℹ️ [Auth] Other auth event:', event);
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
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}