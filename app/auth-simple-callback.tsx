import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase, authService } from '../lib/supabase';

export default function SimpleAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    console.log('🔗 [Simple Callback] Starting with params:', params);
    
    try {
      if (!supabase) {
        console.error('❌ Supabase not configured');
        router.push('/auth');
        return;
      }

      // Wait a moment for Supabase to process the callback
      setTimeout(async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔗 [Simple Callback] Session check:', { 
          session: session?.user?.email, 
          error: error?.message 
        });

        if (session?.user) {
          console.log('✅ [Simple Callback] Success! User:', session.user.email);
          
          try {
            await authService.createOrUpdateProfile(session.user);
            console.log('✅ [Simple Callback] Profile created/updated');
            router.replace('/(tabs)');
          } catch (profileError) {
            console.error('❌ [Simple Callback] Profile error:', profileError);
            // Navigate anyway
            router.replace('/(tabs)');
          }
        } else {
          console.log('❌ [Simple Callback] No session found');
          router.push('/auth');
        }
      }, 1000);

    } catch (error) {
      console.error('❌ [Simple Callback] Error:', error);
      router.push('/auth');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.text}>Processing simple authentication...</Text>
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