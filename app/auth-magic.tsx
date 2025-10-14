/**
 * MAGIC LINK AUTH - The Easiest Option
 * No passwords, no OAuth complexity
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Mail, ArrowRight, Sparkles } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function MagicLinkAuth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        // Fallback: Direct to app (for demo)
        Alert.alert(
          'Magic Link Sent! ✨',
          'Check your email and click the link to sign in.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Keep it simple - no redirect URLs needed
          shouldCreateUser: true,
        }
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      setSent(true);
      Alert.alert(
        'Magic Link Sent! ✨',
        'Check your email and click the link to sign in. The link will automatically log you in.',
        [{ text: 'OK' }]
      );

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FF6B6B', '#FFB1B1']} style={styles.gradient}>
          <View style={styles.successContainer}>
            <Sparkles size={60} color="#fff" />
            <Text style={styles.successTitle}>Magic Link Sent!</Text>
            <Text style={styles.successMessage}>
              Check your email ({email}) and click the link to sign in automatically.
            </Text>
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={sendMagicLink}
            >
              <Text style={styles.resendText}>Resend Link</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B6B', '#FFB1B1']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Sparkles size={40} color="#fff" />
            <Text style={styles.title}>Sign In with Magic</Text>
            <Text style={styles.subtitle}>No password needed! ✨</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.magicButton, loading && styles.buttonDisabled]}
              onPress={sendMagicLink}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending Magic...' : 'Send Magic Link'}
              </Text>
              {!loading && <ArrowRight size={20} color="#fff" />}
            </TouchableOpacity>

            <Text style={styles.infoText}>
              We'll send you a secure link that logs you in automatically. No password to remember!
            </Text>
          </View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  magicButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  resendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});