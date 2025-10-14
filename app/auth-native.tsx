/**
 * NATIVE SOCIAL AUTH - Apple & Google Native SDKs
 * Much more reliable than web OAuth
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Apple, User } from 'lucide-react-native';
// Note: You'll need to install these packages:
// npx expo install @react-native-google-signin/google-signin
// npx expo install @invertase/react-native-apple-authentication

export default function NativeSocialAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState<'apple' | 'google' | null>(null);

  const signInWithApple = async () => {
    setLoading('apple');
    
    try {
      // Apple Sign-In is much more reliable
      if (Platform.OS !== 'ios') {
        Alert.alert('Apple Sign-In', 'Only available on iOS devices');
        return;
      }

      // TODO: Implement Apple Sign-In
      // const appleAuthRequestResponse = await appleAuth.performRequest({
      //   requestedOperation: appleAuth.Operation.LOGIN,
      //   requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      // });

      // For demo: simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Apple Sign-In Success! 🎉',
        'Welcome to PawMatch!',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
      );

    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled
        return;
      }
      Alert.alert('Error', 'Apple Sign-In failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const signInWithGoogle = async () => {
    setLoading('google');
    
    try {
      // Google Sign-In with native SDK is much more reliable
      // TODO: Implement Google Sign-In
      // await GoogleSignin.hasPlayServices();
      // const userInfo = await GoogleSignin.signIn();

      // For demo: simulate success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Google Sign-In Success! 🎉',
        'Welcome to PawMatch!',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
      );

    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        // User canceled
        return;
      }
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const continueAsGuest = () => {
    Alert.alert(
      'Continue as Guest',
      'You can browse pets without signing in. Sign in later to save favorites and apply for adoption.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.replace('/(tabs)') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B6B', '#FFB1B1']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to PawMatch</Text>
            <Text style={styles.subtitle}>Find your perfect furry companion</Text>
          </View>

          <View style={styles.authButtons}>
            {/* Apple Sign-In (iOS only) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.appleButton, loading === 'apple' && styles.buttonDisabled]}
                onPress={signInWithApple}
                disabled={loading !== null}
              >
                <Apple size={20} color="#fff" />
                <Text style={styles.appleButtonText}>
                  {loading === 'apple' ? 'Signing in...' : 'Continue with Apple'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Google Sign-In */}
            <TouchableOpacity
              style={[styles.googleButton, loading === 'google' && styles.buttonDisabled]}
              onPress={signInWithGoogle}
              disabled={loading !== null}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleG}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>
                {loading === 'google' ? 'Signing in...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            {/* Guest Mode */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={continueAsGuest}
              disabled={loading !== null}
            >
              <User size={20} color="#666" />
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.infoText}>
            Native sign-in is more secure and reliable than web-based OAuth
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  authButtons: {
    gap: 15,
    marginBottom: 30,
  },
  appleButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  infoText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
});