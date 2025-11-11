import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../lib/supabase';
import AnimatedLoader from '../../../components/AnimatedLoader';

export default function AuthCallbackWeb() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 [Web Auth Callback] Processing callback with params:', params);
        
        // Check for error parameters
        if (params.error) {
          console.error('❌ [Web Auth Callback] OAuth error:', params.error);
          setTimeout(() => {
            router.push({
              pathname: '/auth',
              params: {
                error: params.error as string,
                errorDescription: params.error_description as string || 'Authentication failed'
              }
            });
          }, 2000);
          return;
        }

        // Check for access token in hash parameters (OAuth implicit flow)
        if (typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            console.log('✅ [Web Auth Callback] Access token found in hash');
            
            // Set the session with the tokens
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });

            if (error) {
              console.error('❌ [Web Auth Callback] Error setting session:', error);
              router.push('/');
              return;
            }

            if (session?.user) {
              console.log('✅ [Web Auth Callback] Session established for:', session.user.email);
              router.replace('/(tabs)');
            } else {
              console.log('⚠️ [Web Auth Callback] No session created');
              router.push('/');
            }
            return;
          }
        }

        // Check for code parameter (OAuth authorization code flow)
        if (params.code) {
          console.log('🔄 [Web Auth Callback] Processing authorization code');
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(params.code as string);
          
          if (error) {
            console.error('❌ [Web Auth Callback] Error exchanging code:', error);
            router.push('/auth');
            return;
          }

          if (data?.session?.user) {
            console.log('✅ [Web Auth Callback] Session created for:', data.session.user.email);
            router.replace('/(tabs)');
          } else {
            console.log('⚠️ [Web Auth Callback] No session from code exchange');
            router.push('/auth');
          }
          return;
        }

        // No valid auth data found
        console.log('⚠️ [Web Auth Callback] No valid auth data found');
        setTimeout(() => {
          router.push('/auth');
        }, 2000);

      } catch (error) {
        console.error('💥 [Web Auth Callback] Processing error:', error);
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [params, router]);

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E', '#FFB1B1']}
      style={styles.container}
    >
      <View style={styles.content}>
        <AnimatedLoader variant="paws" size="large" />
        <Text style={styles.title}>🐾 PawMatch</Text>
        <Text style={styles.message}>Processing authentication...</Text>
        <Text style={styles.subtitle}>Please wait while we verify your credentials</Text>
        
        {params.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Authentication Error: {params.error_description || params.error}
            </Text>
            <Text style={styles.errorSubtext}>Redirecting to login...</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    minWidth: 300,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.5)',
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  errorSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
});