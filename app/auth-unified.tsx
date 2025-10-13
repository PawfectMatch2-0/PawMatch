import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase, authService } from '../lib/supabase';
import { authenticateWithGoogle } from '../lib/mobile-auth-simple';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function SimpleUnifiedAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setStatus('Initializing authentication...');
      
      if (!supabase) {
        throw new Error('Authentication service not configured');
      }

      if (Platform.OS === 'web') {
        console.log('🔐 [Unified Auth] Web platform - using simple OAuth');
        setStatus('Opening Google sign-in...');
        
        // Simple web OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth-simple-callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });

        if (error) throw error;
        // Browser will redirect automatically
        
      } else {
        console.log('🔐 [Unified Auth] Mobile platform - using WebBrowser');
        setStatus('Opening browser for Google sign-in...');
        
        // Mobile authentication
        const result = await authenticateWithGoogle();
        
        if (result?.success && result.user) {
          console.log('✅ [Unified Auth] Mobile auth successful:', result.user.email);
          setStatus('Creating profile...');
          
          // Create/update profile
          await authService.createOrUpdateProfile(result.user);
          
          setStatus('Authentication complete!');
          
          // Navigate to main app
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 500);
        } else {
          throw new Error('Mobile authentication failed');
        }
      }
      
    } catch (error: any) {
      console.error('❌ [Unified Auth] Error:', error);
      setStatus('');
      Alert.alert('Authentication Error', error.message || 'Failed to sign in with Google');
    } finally {
      if (Platform.OS !== 'web') {
        setLoading(false);
      }
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('✅ [Unified Auth] Found existing session:', session.user.email);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const handleGuestMode = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>🐾 PawMatch</Text>
          <Text style={styles.subtitle}>Find your perfect pet companion</Text>
          
          <View style={styles.authSection}>
            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Continue with Google</Text>
              )}
            </TouchableOpacity>
            
            {status ? (
              <Text style={styles.status}>{status}</Text>
            ) : null}
            
            <TouchableOpacity
              style={[styles.button, styles.guestButton]}
              onPress={handleGuestMode}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.guestButtonText]}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.platformInfo}>
            Platform: {Platform.OS} | 
            {Platform.OS === 'web' ? ' Redirect Mode' : ' WebBrowser Mode'}
          </Text>
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
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 60,
    textAlign: 'center',
  },
  authSection: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
  },
  guestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  guestButtonText: {
    color: 'white',
  },
  status: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  platformInfo: {
    position: 'absolute',
    bottom: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
});