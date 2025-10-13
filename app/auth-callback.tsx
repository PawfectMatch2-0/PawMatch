/**
 * auth-callback.tsx
 * 
 * This screen handles deep links back to the app after authentication.
 * For example, when redirecting from web authentication to the mobile app.
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase, authService } from '../lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    // Function to process the authentication callback
    const processAuthCallback = async () => {
      try {
        console.log('🔄 [Auth Callback] Starting with params:', JSON.stringify(params, null, 2));
        
        if (!supabase) {
          console.error('❌ [Auth Callback] Supabase not configured');
          router.push('/auth');
          return;
        }
        
        // Check if we have an auth error first
        if (params.error) {
          console.error('❌ [Auth Callback] OAuth error:', params.error);
          console.error('❌ [Auth Callback] Error description:', params.error_description);
          
          setTimeout(() => {
            router.push({
              pathname: '/auth',
              params: { 
                error: params.error as string,
                errorDescription: params.error_description as string
              }
            });
          }, 1000);
          return;
        }
        
        // If we have an authorization code, try to exchange it for a session
        if (params.code) {
          console.log('🔄 [Auth Callback] Found authorization code, exchanging for session...');
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(params.code as string);
            
            if (error) {
              console.error('❌ [Auth Callback] Code exchange error:', error);
              router.push('/auth');
              return;
            }
            
            if (data.session) {
              console.log('✅ [Auth Callback] Session created from code exchange');
              console.log('📋 [Auth Callback] User:', data.session.user.email);
              
              // Create or update user profile
              await authService.createOrUpdateProfile(data.session.user);
              
              // Navigate to the main app
              console.log('� [Auth Callback] Redirecting to main app');
              router.replace('/(tabs)');
              return;
            }
          } catch (codeError) {
            console.error('❌ [Auth Callback] Code exchange exception:', codeError);
          }
        }
        
        // Fallback: Check for existing session
        console.log('�🔄 [Auth Callback] Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [Auth Callback] Session check error:', error);
          router.push('/auth');
          return;
        }
        
        if (session?.user) {
          console.log('✅ [Auth Callback] Found existing session:', session.user.email);
          
          // Create or update user profile
          await authService.createOrUpdateProfile(session.user);
          
          // Navigate to the main app
          console.log('🚀 [Auth Callback] Redirecting to main app from existing session');
          router.replace('/(tabs)');
        } else {
          console.log('⚠️ [Auth Callback] No session found after OAuth callback');
          console.log('🔍 [Auth Callback] Available params:', Object.keys(params));
          
          // Wait a moment for session to be established, then try once more
          setTimeout(async () => {
            if (supabase) {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession?.user) {
                console.log('✅ [Auth Callback] Session found on retry');
                await authService.createOrUpdateProfile(retrySession.user);
                router.replace('/(tabs)');
              } else {
                console.log('❌ [Auth Callback] Still no session, redirecting to auth');
                router.push('/auth');
              }
            } else {
              router.push('/auth');
            }
          }, 2000);
        }
      } catch (error) {
        console.error('❌ [Auth Callback] Processing error:', error);
        router.push('/auth');
      }
    };
    
    // Process the auth callback
    processAuthCallback();
  }, [router, params]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.text}>Completing authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
