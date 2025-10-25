import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Heart, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStatus } from '../hooks/useAuth';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const { isSignedIn, isLoading, isReady, user } = useAuthStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle auth state
  useEffect(() => {
    if (isReady && isSignedIn) {
      console.log('🔍 [Splash] User already signed in:', user?.email);
      router.replace('/(tabs)');
    }
  }, [isReady, isSignedIn, user, router]);

  const handleGetStarted = () => {
    // Skip auth - go straight to browsing
    router.push('/(tabs)');
  };

  const handleAuthOptions = () => {
    router.push('/auth-enhanced');
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={COLORS.gradients.primary}
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
      colors={COLORS.gradients.secondary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoImageWrapper}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Pawfect Match</Text>
            <Text style={styles.tagline}>Find your perfect furry friend</Text>
          </View>

          {showContent && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <User size={20} color={COLORS.primary} />
                <Text style={styles.primaryButtonText}>Start Browsing Pets</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleAuthOptions}>
                <Text style={styles.secondaryButtonText}>Sign In Options</Text>
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
    justifyContent: 'center',
    marginBottom: 80,
    width: '100%',
  },
  logoImageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 120,
    height: 120,
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
    fontSize: Math.min(width * 0.12, 52),
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: Math.min(width * 0.04, 18),
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 15,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#E67E9C',
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});