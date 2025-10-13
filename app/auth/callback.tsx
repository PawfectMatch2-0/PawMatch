import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase, authService } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 Auth callback: Processing callback');
        
        if (!supabase) {
          console.error('🔍 Auth callback: Supabase not available');
          router.replace('/auth');
          return;
        }
        
        // Check if we have a session (mobile-safe approach)
        console.log('🔍 Auth callback: Getting session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('🔍 Auth callback: Session result', session ? 'Found session' : 'No session');
        if (session) {
          console.log('🔍 Auth callback: User email:', session.user.email);
        }
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          router.replace('/auth');
          return;
        }

        if (session?.user) {
          // Create or update the user profile
          console.log('🔍 Auth callback: Creating/updating profile');
          await authService.createOrUpdateProfile(session.user);
          
          // Navigate to the main app
          console.log('🔍 Auth callback: Redirecting to main app');
          router.replace('/(tabs)');
        } else {
          // No session found, go back to auth
          console.log('❌ Auth callback: No session found, returning to auth');
          router.replace('/auth');
        }
      } catch (error) {
        console.error('❌ Auth callback error:', error);
        router.replace('/auth');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.text}>Completing sign in...</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});
