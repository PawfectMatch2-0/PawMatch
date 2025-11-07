/**
 * Enhanced Authentication Screen with JWT and Forgot Password
 * Features: Sign in/up, password reset, email verification, modern UI
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
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native'
import { authService, SignUpData, SignInData } from '../lib/enhanced-auth'
import { COLORS } from '../constants/theme'

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset' | 'email-sent' | 'email-confirm'

export default function EnhancedAuth() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [resetEmail, setResetEmail] = useState('')

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((state) => {
      if (state.user && state.session) {
        console.log('🔐 [Auth] User authenticated, redirecting to app')
        router.replace('/(tabs)')
      }
    })

    return unsubscribe
  }, [router])

  // Validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  // Handle sign in
  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    
    const signInData: SignInData = { email, password }
    const result = await authService.signIn(signInData)
    
    setLoading(false)

    if (result.success) {
      console.log('✅ Sign in successful')
      // Navigation handled by auth state listener
    } else {
      Alert.alert('Sign In Failed', result.error || 'Please try again')
    }
  }

  // Handle sign up
  const handleSignUp = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match')
      return
    }

    if (!fullName.trim()) {
      Alert.alert('Name Required', 'Please enter your full name')
      return
    }

    setLoading(true)
    
    const signUpData: SignUpData = { email, password, fullName }
    const result = await authService.signUp(signUpData)
    
    setLoading(false)

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setMode('email-confirm')
      } else {
        console.log('✅ Sign up successful')
        // Navigation handled by auth state listener
      }
    } else {
      Alert.alert('Sign Up Failed', result.error || 'Please try again')
    }
  }

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!validateEmail(resetEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address')
      return
    }

    setLoading(true)
    
    const result = await authService.forgotPassword({ email: resetEmail })
    
    setLoading(false)

    if (result.success) {
      setMode('email-sent')
    } else {
      Alert.alert('Error', result.error || 'Failed to send reset email')
    }
  }

  // Handle resend confirmation
  const handleResendConfirmation = async () => {
    setLoading(true)
    
    const result = await authService.resendConfirmation(email)
    
    setLoading(false)

    if (result.success) {
      Alert.alert('Email Sent', result.message || 'Confirmation email sent')
    } else {
      Alert.alert('Error', result.error || 'Failed to resend email')
    }
  }

  // Render different modes
  const renderContent = () => {
    switch (mode) {
      case 'signup':
        return (
          <>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join PawMatch to find your perfect companion</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
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
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('signin')}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )

      case 'forgot':
        return (
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setMode('signin')}
            >
              <ArrowLeft size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send Reset Link</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )

      case 'email-sent':
        return (
          <>
            <View style={styles.iconContainer}>
              <CheckCircle size={60} color="#4CAF50" />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to {resetEmail}
            </Text>
            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or try again
            </Text>

            <View style={styles.form}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>Resend Email</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('signin')}
              >
                <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )

      case 'email-confirm':
        return (
          <>
            <View style={styles.iconContainer}>
              <AlertCircle size={60} color="#FF9800" />
            </View>
            <Text style={styles.title}>Confirm Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a confirmation link to {email}
            </Text>
            <Text style={styles.helpText}>
              Please check your email and click the confirmation link to activate your account
            </Text>

            <View style={styles.form}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleResendConfirmation}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.primaryButtonText}>Resend Confirmation</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('signin')}
              >
                <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        )

      default: // signin
        return (
          <>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to PawMatch</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color="#666" />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
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

              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() => setMode('forgot')}
              >
                <Text style={styles.forgotButtonText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setMode('signup')}
              >
                <Text style={styles.secondaryButtonText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )
    }
  }

  return (
    <LinearGradient colors={COLORS.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {mode === 'signin' && (
                <View style={styles.logoContainer}>
                  <View style={styles.logoImageWrapper}>
                    <Image 
                      source={require('../assets/images/icon.png')} 
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.appName}>Pawfect Match</Text>
                </View>
              )}

              <View style={styles.authCard}>
                {renderContent()}
              </View>

              {(mode === 'signin' || mode === 'signup') && (
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => router.push('/(tabs)')}
                >
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 85,
    height: 85,
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
  authCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
  helpText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: COLORS.primary,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#666',
  },
  guestButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  guestButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: 'white',
  },
})