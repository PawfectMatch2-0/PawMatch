import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ArrowLeft, User, Heart } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase, authService } from '../lib/supabase';
// Import both direct auth for web and mobile auth for mobile
import { DirectAuth } from '../lib/direct-auth';
import { authenticateWithGoogle } from '../lib/mobile-auth-simple';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle errors from auth callback
  useEffect(() => {
    if (params.error) {
      setError(params.errorDescription as string || params.error as string || 'Authentication failed');
    }
  }, [params]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let result: any;
      
      if (Platform.OS === 'web') {
        console.log('🔐 [Auth] Using DirectAuth for web platform');
        result = await DirectAuth.signInWithGoogle();
      } else {
        console.log('🔐 [Auth] Using Mobile Auth for mobile platform');
        result = await authenticateWithGoogle();
      }
      
      if (result && 'success' in result && result.success && result.user) {
        console.log('🔐 [Auth] Authentication successful!', result.user.email);
        router.replace('/(tabs)');
      } else if (result && 'type' in result && result.type === 'success') {
        console.log('🔐 [Auth] Web authentication successful!');
        router.replace('/(tabs)');
      } else {
        const errorMessage = (result && 'error' in result) ? result.error : 'Authentication failed';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('🔐 [Auth] Sign in error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔐 [Auth] Guest mode selected');
      // Navigate directly to main app without authentication
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('🔐 [Auth] Guest mode error:', error);
      setError('Failed to continue as guest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.container}
      >
        <LoadingState 
          variant="fullScreen" 
          message="Setting up your account..."
          size="large"
        />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryLight, COLORS.primaryLighter]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* App Branding */}
          <View style={styles.brandingContainer}>
            <View style={styles.logoContainer}>
              <Heart size={48} color={COLORS.white} fill={COLORS.white} />
            </View>
            <Text style={styles.title}>Welcome to PawMatch!</Text>
            <Text style={styles.subtitle}>Find your perfect furry companion</Text>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Value Proposition */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Join thousands of pet lovers</Text>
            <View style={styles.featuresList}>
              <Text style={styles.featureItem}>🐾 Discover adoptable pets nearby</Text>
              <Text style={styles.featureItem}>❤️ Save your favorite pets</Text>
              <Text style={styles.featureItem}>🏥 Get AI veterinary advice</Text>
              <Text style={styles.featureItem}>📚 Learn pet care tips</Text>
            </View>
          </View>

          {/* Authentication Options */}
          <View style={styles.authOptions}>
            {/* Google Sign In Button */}
            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              disabled={loading}
              loading={loading}
              variant="primary"
              icon={
                !loading && (
                  <View style={styles.googleIcon}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                )
              }
              style={styles.googleButton}
            />

            {/* Or Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Mode Button */}
            <Button
              title="Continue as Guest"
              onPress={handleGuestMode}
              disabled={loading}
              variant="ghost"
              icon={<User size={20} color={COLORS.white} />}
              style={styles.guestButton}
              textStyle={styles.guestButtonText}
            />
          </View>

          {/* Disclaimer */}
          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
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
    paddingHorizontal: SPACING.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    minHeight: SPACING.minTouchTarget,
  },
  backButton: {
    width: SPACING.minTouchTarget,
    height: SPACING.minTouchTarget,
    borderRadius: SPACING.minTouchTarget / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xxxl,
  },
  
  // Branding
  brandingContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  
  // Error handling
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorText: {
    color: COLORS.white,
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
  },
  
  // Features section
  featuresContainer: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    ...TYPOGRAPHY.h5,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  featuresList: {
    gap: SPACING.sm,
  },
  featureItem: {
    ...TYPOGRAPHY.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  
  // Authentication
  authOptions: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  googleButton: {
    backgroundColor: COLORS.white,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontPrimaryBold,
  },
  guestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  guestButtonText: {
    color: COLORS.white,
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    ...TYPOGRAPHY.labelMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: SPACING.md,
  },
  
  // Disclaimer
  disclaimer: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
