/**
 * GUEST MODE AUTH
 * No sign-up required - browse first, auth later
 */

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Heart, User, Mail, Sparkles } from 'lucide-react-native';

export default function GuestModeAuth() {
  const router = useRouter();

  const continueAsGuest = () => {
    // Store guest mode flag for later auth prompts
    router.replace('/(tabs)');
  };

  const signUp = () => {
    router.push('/auth-simple');
  };

  const signIn = () => {
    router.push('/auth-simple');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B6B', '#FFB1B1']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Heart size={60} color="#fff" fill="#fff" />
            <Text style={styles.title}>Welcome to PawMatch</Text>
            <Text style={styles.subtitle}>
              Find your perfect furry companion and give them a loving home
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🐕</Text>
              <Text style={styles.featureText}>Browse thousands of pets</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>❤️</Text>
              <Text style={styles.featureText}>Save your favorites</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📋</Text>
              <Text style={styles.featureText}>Apply for adoption</Text>
            </View>
          </View>

          <View style={styles.authOptions}>
            {/* Primary: Browse as Guest */}
            <TouchableOpacity style={styles.guestButton} onPress={continueAsGuest}>
              <User size={20} color="#FF6B6B" />
              <Text style={styles.guestButtonText}>Start Browsing</Text>
              <Text style={styles.guestSubtext}>No account needed</Text>
            </TouchableOpacity>

            {/* Secondary Options */}
            <View style={styles.secondaryOptions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={signIn}>
                <Sparkles size={18} color="#fff" />
                <Text style={styles.secondaryText}>Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
                <Mail size={18} color="#fff" />
                <Text style={styles.secondaryText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            You can create an account anytime to save favorites and apply for adoption
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
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  authOptions: {
    gap: 20,
  },
  guestButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  guestSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  secondaryOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 20,
    lineHeight: 16,
  },
});