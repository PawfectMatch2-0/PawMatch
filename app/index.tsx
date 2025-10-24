import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Heart, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStatus } from '../hooks/useAuth';

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
      <View style={[styles.container, { backgroundColor: 'white' }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Heart size={60} color="#E67E9C" fill="#E67E9C" />
              </View>
              <Text style={styles.appName}>PawfectMatch</Text>
              <Text style={styles.tagline}>Loading...</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
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
            <Text style={styles.appName}>Pawfect{'\n'}Match</Text>
            <Text style={styles.tagline}>Find your perfect furry friend</Text>
          </View>

          {showContent && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                <User size={20} color="white" />
                <Text style={styles.primaryButtonText}>Start Browsing Pets</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={handleAuthOptions}>
                <Text style={styles.secondaryButtonText}>Sign In Options</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
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
  logoImageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
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
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    color: '#E67E9C',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 52,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
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
    backgroundColor: '#E67E9C',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 15,
    gap: 10,
    shadowColor: '#E67E9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
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
    borderColor: '#E67E9C',
  },
  secondaryButtonText: {
    color: '#E67E9C',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});