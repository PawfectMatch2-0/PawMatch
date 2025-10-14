/**
 * Password Reset Handler
 * Handles password reset from email links
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Lock, Eye, EyeOff, Heart, CheckCircle } from 'lucide-react-native'
import { supabase } from '../../lib/enhanced-auth'

export default function ResetPassword() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isValidLink, setIsValidLink] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const checkResetLink = async () => {
      try {
        // Extract tokens from URL params
        const { access_token, refresh_token, type } = params

        if (type !== 'recovery' || !access_token || !refresh_token) {
          Alert.alert('Invalid Link', 'This password reset link is invalid or expired.')
          router.push('/auth-enhanced')
          return
        }

        // Set the session with the recovery tokens
        const { error } = await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        })

        if (error) {
          console.error('Reset link validation error:', error)
          Alert.alert('Invalid Link', 'This password reset link is invalid or expired.')
          router.push('/auth-enhanced')
          return
        }

        setIsValidLink(true)
      } catch (error) {
        console.error('Reset link check failed:', error)
        Alert.alert('Error', 'Failed to validate reset link.')
        router.push('/auth-enhanced')
      }
    }

    checkResetLink()
  }, [params, router])

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleResetPassword = async () => {
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password reset error:', error)
        Alert.alert('Error', error.message || 'Failed to reset password')
        setLoading(false)
        return
      }

      console.log('✅ Password reset successful')
      setLoading(false)
      setSuccess(true)

      // Redirect to app after a delay
      setTimeout(() => {
        router.replace('/(tabs)')
      }, 2000)

    } catch (error) {
      console.error('Password reset failed:', error)
      Alert.alert('Error', 'Failed to reset password. Please try again.')
      setLoading(false)
    }
  }

  if (!isValidLink) {
    return (
      <LinearGradient colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Validating reset link...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  if (success) {
    return (
      <LinearGradient colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Heart size={40} color="white" fill="white" />
              </View>
              <Text style={styles.appName}>PawMatch</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <CheckCircle size={80} color="#4CAF50" />
              </View>
              <Text style={styles.title}>Password Updated!</Text>
              <Text style={styles.message}>
                Your password has been successfully updated. You can now sign in with your new password.
              </Text>
              <Text style={styles.subtitle}>Redirecting to app...</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#FF6B6B', '#FF8E8E', '#FFB3B3']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Heart size={40} color="white" fill="white" />
              </View>
              <Text style={styles.appName}>PawMatch</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.subtitle}>
                Enter your new password below
              </Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#666" />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="New Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color="#666" />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.helpText}>
                Password must be at least 6 characters long
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
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
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  helpText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
})