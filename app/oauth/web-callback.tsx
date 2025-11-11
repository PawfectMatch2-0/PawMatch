/**
 * OAuth Web Callback Handler
 * Professional OAuth implementation for web platforms
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function WebOAuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    const handleWebOAuthCallback = async () => {
      try {
        console.log('🌐 [Web OAuth] Processing web OAuth callback');
        
        if (!supabase) {
          console.error('🌐 [Web OAuth] Supabase not available');
          router.push('/');
          return;
        }
        
        // Let Supabase handle the OAuth callback automatically
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🌐 [Web OAuth] Session error:', error);
          router.push('/');
          return;
        }
        
        if (data.session) {
          console.log('🌐 [Web OAuth] Session established:', data.session.user.email);
          router.push('/(tabs)');
        } else {
          console.log('🌐 [Web OAuth] No session found, redirecting to auth');
          router.push('/');
        }
        
      } catch (error: any) {
        console.error('🌐 [Web OAuth] Callback error:', error);
        router.push('/');
      }
    };
    
    // Small delay to ensure URL is processed
    const timer = setTimeout(handleWebOAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Processing authentication...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});