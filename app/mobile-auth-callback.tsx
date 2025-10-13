import { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase, authService } from '../lib/supabase';
import { ActivityIndicator } from 'react-native';

export default function MobileAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleMobileCallback();
  }, []);

  const handleMobileCallback = async () => {
    console.log('📱 [Mobile Callback] Processing mobile auth callback');
    console.log('📱 [Mobile Callback] Params:', params);
    console.log('📱 [Mobile Callback] Platform:', Platform.OS);
    
    try {
      if (!supabase) {
        console.error('❌ [Mobile Callback] Supabase not configured');
        router.replace('/auth');
        return;
      }

      // Handle different callback scenarios
      if (params.error) {
        console.error('❌ [Mobile Callback] OAuth error:', params.error);
        router.replace('/auth');
        return;
      }

      // If we have tokens in params, set the session directly
      if (params.access_token && params.refresh_token) {
        console.log('📱 [Mobile Callback] Found tokens in params, setting session...');
        
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token as string,
          refresh_token: params.refresh_token as string
        });

        if (error) {
          console.error('❌ [Mobile Callback] Session error:', error);
          router.replace('/auth');
          return;
        }

        if (data.session?.user) {
          console.log('✅ [Mobile Callback] Session established from tokens');
          await authService.createOrUpdateProfile(data.session.user);
          router.replace('/(tabs)');
          return;
        }
      }

      // If we have an authorization code, exchange it
      if (params.code) {
        console.log('📱 [Mobile Callback] Found authorization code, exchanging...');
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(params.code as string);

        if (error) {
          console.error('❌ [Mobile Callback] Code exchange error:', error);
          router.replace('/auth');
          return;
        }

        if (data.session?.user) {
          console.log('✅ [Mobile Callback] Session established from code exchange');
          await authService.createOrUpdateProfile(data.session.user);
          router.replace('/(tabs)');
          return;
        }
      }

      // Fallback: Check for existing session
      console.log('📱 [Mobile Callback] Checking for existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ [Mobile Callback] Session check error:', error);
        router.replace('/auth');
        return;
      }

      if (session?.user) {
        console.log('✅ [Mobile Callback] Found existing session');
        await authService.createOrUpdateProfile(session.user);
        router.replace('/(tabs)');
      } else {
        console.log('❌ [Mobile Callback] No session found');
        router.replace('/auth');
      }

    } catch (error) {
      console.error('❌ [Mobile Callback] Error:', error);
      router.replace('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.title}>Processing Authentication</Text>
      <Text style={styles.subtitle}>
        {Platform.OS === 'web' ? 'Web callback processing...' : 'Mobile callback processing...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});