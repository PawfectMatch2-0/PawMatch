import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Heart, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        if (!supabase) {
          console.log('🔍 [Splash] Supabase not configured, showing auth options');
          setCheckingAuth(false);
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔍 [Splash] Error checking session:', error);
          setCheckingAuth(false);
          return;
        }

        if (session?.user) {
          console.log('🔍 [Splash] Found existing session for:', session.user.email);
          router.replace('/(tabs)');
          return;
        }

        console.log('🔍 [Splash] No existing session found');
        setCheckingAuth(false);
      } catch (error) {
        console.error('🔍 [Splash] Auth check failed:', error);
        setCheckingAuth(false);
      }
    };

    checkAuthSession();
  }, [router]);

  const handleGetStarted = () => {
    router.push('/auth');
  };

  if (checkingAuth) {
    return (
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Heart size={60} color="white" fill="white" />
              </View>
              <Text style={styles.appName}>PawMatch</Text>
              <Text style={styles.tagline}>Loading...</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Heart size={60} color="white" fill="white" />
            </View>
            <Text style={styles.appName}>PawMatch</Text>
            <Text style={styles.tagline}>Find your perfect furry friend</Text>
          </View>

          {showContent && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <User size={20} color="white" />
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});