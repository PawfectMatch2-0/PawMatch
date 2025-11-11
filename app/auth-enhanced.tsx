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
  Linking,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native'
import { authService, SignUpData, SignInData } from '../lib/enhanced-auth'
import { COLORS } from '../constants/theme'

// Initialize WebBrowser for mobile auth
WebBrowser.maybeCompleteAuthSession()

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
  
  // Field errors
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    fullName?: string
  }>({})
  
  // General error message (for deleted users, etc.)
  const [generalError, setGeneralError] = useState<string | null>(null)

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

  // Validation functions
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    // Check if user put name in email field (contains spaces or no @)
    if (email.includes(' ') && !email.includes('@')) {
      return 'This looks like a name. Please enter your email address'
    }
    return null
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return null
  }

  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return 'Full name is required'
    }
    // Check if user put email in name field
    if (name.includes('@')) {
      return 'This looks like an email. Please enter your full name'
    }
    // Check if user put phone number in name field (contains only digits)
    if (/^\d+$/.test(name.trim().replace(/[\s-()]/g, ''))) {
      return 'This looks like a phone number. Please enter your full name'
    }
    // Check if name is too short
    if (name.trim().length < 2) {
      return 'Please enter your full name (at least 2 characters)'
    }
    // Check if name contains invalid characters (only numbers/symbols)
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      return 'Name should only contain letters, spaces, hyphens, and apostrophes'
    }
    return null
  }

  const validateConfirmPassword = (confirm: string, original: string) => {
    if (!confirm) {
      return 'Please confirm your password'
    }
    if (confirm !== original) {
      return 'Passwords do not match'
    }
    return null
  }

  // Clear error for a specific field
  const clearError = (field: keyof typeof errors) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  // Validate all fields
  const validateAllFields = () => {
    const newErrors: typeof errors = {}
    
    const emailError = validateEmail(email)
    if (emailError) newErrors.email = emailError
    
    const passwordError = validatePassword(password)
    if (passwordError) newErrors.password = passwordError
    
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password)
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError
    
    const fullNameError = validateFullName(fullName)
    if (fullNameError) newErrors.fullName = fullNameError
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle sign in
  const handleSignIn = async () => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    if (emailError || passwordError) {
      const newErrors: { email?: string; password?: string } = {}
      if (emailError) newErrors.email = emailError
      if (passwordError) newErrors.password = passwordError
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setGeneralError(null) // Clear previous errors
    
    const signInData: SignInData = { email, password }
    const result = await authService.signIn(signInData)
    
    setLoading(false)

    if (result.success) {
      console.log('✅ Sign in successful')
      setGeneralError(null)
      // Navigation handled by auth state listener
    } else {
      // Set general error message to show in UI
      setGeneralError(result.error || 'Sign in failed. Please try again.')
      
      // Check if error suggests signing up (deleted user)
      if (result.suggestSignUp || result.error?.toLowerCase().includes('deleted') || result.error?.toLowerCase().includes('create a new account')) {
        // Show alert AND visual error
        Alert.alert(
          'Account Not Available', 
          result.error || 'This account may have been deleted. Please create a new account.',
          [
            { 
              text: 'Sign Up', 
              onPress: () => {
                setMode('signup')
                setEmail(email) // Keep the email they entered
                setPassword('')
                setErrors({})
                setGeneralError(null)
              },
              style: 'default' 
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        )
      } else if (result.error?.toLowerCase().includes('email') && 
          (result.error?.toLowerCase().includes('confirm') || 
           result.error?.toLowerCase().includes('verify') ||
           result.requiresEmailConfirmation)) {
        // Show email confirmation screen
        setMode('email-confirm')
        Alert.alert(
          'Email Not Confirmed', 
          result.error || 'Please check your email and click the confirmation link before signing in.',
          [
            { text: 'OK', style: 'default' }
          ]
        )
      } else {
        // Show alert for other errors
        Alert.alert('Sign In Failed', result.error || 'Please try again')
      }
    }
  }

  // Handle sign up
  const handleSignUp = async () => {
    // Validate all fields
    if (!validateAllFields()) {
      // Scroll to first error if needed
      return
    }

    setLoading(true)
    
    const signUpData: SignUpData = { email: email.trim(), password, fullName: fullName.trim() }
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
      // Handle specific error messages
      let errorMessage = result.error || 'Please try again'
      
      // Check for common Supabase errors
      if (errorMessage.toLowerCase().includes('user already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.'
      } else if (errorMessage.toLowerCase().includes('invalid email')) {
        setErrors(prev => ({ ...prev, email: 'Invalid email address' }))
        return
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: 'Password is too weak or invalid' }))
        return
      }
      
      Alert.alert('Sign Up Failed', errorMessage)
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
              <View>
                <View style={[
                  styles.inputContainer,
                  errors.fullName && styles.inputContainerError
                ]}>
                  <User size={20} color={errors.fullName ? "#F44336" : "#666"} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text)
                      clearError('fullName')
                    }}
                    onBlur={() => {
                      const error = validateFullName(fullName)
                      if (error) {
                        setErrors(prev => ({ ...prev, fullName: error }))
                      }
                    }}
                    autoCapitalize="words"
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              <View>
                <View style={[
                  styles.inputContainer,
                  errors.email && styles.inputContainerError
                ]}>
                  <Mail size={20} color={errors.email ? "#F44336" : "#666"} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      clearError('email')
                    }}
                    onBlur={() => {
                      const error = validateEmail(email)
                      if (error) {
                        setErrors(prev => ({ ...prev, email: error }))
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View>
                <View style={[
                  styles.inputContainer,
                  errors.password && styles.inputContainerError
                ]}>
                  <Lock size={20} color={errors.password ? "#F44336" : "#666"} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      clearError('password')
                      // Also clear confirm password error if passwords now match
                      if (confirmPassword && text === confirmPassword) {
                        clearError('confirmPassword')
                      }
                    }}
                    onBlur={() => {
                      const error = validatePassword(password)
                      if (error) {
                        setErrors(prev => ({ ...prev, password: error }))
                      }
                    }}
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
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View>
                <View style={[
                  styles.inputContainer,
                  errors.confirmPassword && styles.inputContainerError
                ]}>
                  <Lock size={20} color={errors.confirmPassword ? "#F44336" : "#666"} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text)
                      clearError('confirmPassword')
                    }}
                    onBlur={() => {
                      const error = validateConfirmPassword(confirmPassword, password)
                      if (error) {
                        setErrors(prev => ({ ...prev, confirmPassword: error }))
                      }
                    }}
                    secureTextEntry={true}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.primaryButtonIconCircle}>
                    <ActivityIndicator color="white" />
                  </View>
                ) : (
                  <View style={styles.primaryButtonIconCircle}>
                    <ArrowRight size={20} color="white" />
                  </View>
                )}
                <View style={styles.primaryButtonTextContainer}>
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                  <Text style={styles.primaryButtonSubtext}>Join PawMatch today!</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setMode('signin')
                  setErrors({})
                }}
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
              <Mail size={60} color="#FF9800" />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a confirmation email to {email}
            </Text>
            <View style={styles.warningBox}>
              <AlertCircle size={20} color="#FF9800" />
              <Text style={styles.warningText}>
                You must confirm your email before you can sign in. Please check your inbox and click the confirmation link.
              </Text>
            </View>
            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or click "Resend Confirmation" below.
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
                  <>
                    <Mail size={20} color="white" />
                    <Text style={styles.primaryButtonText}>Resend Confirmation Email</Text>
                  </>
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

            {/* General Error Message */}
            {generalError && (
              <View style={styles.generalErrorContainer}>
                <AlertCircle size={16} color="#F44336" />
                <Text style={styles.generalErrorText}>
                  {generalError.toLowerCase().includes('deleted') 
                    ? 'This account has been deleted. Please create a new account.'
                    : generalError}
                </Text>
                {generalError.toLowerCase().includes('deleted') && (
                  <TouchableOpacity
                    style={styles.signUpLink}
                    onPress={() => {
                      setMode('signup')
                      setEmail(email)
                      setPassword('')
                      setErrors({})
                      setGeneralError(null)
                    }}
                  >
                    <Text style={styles.signUpLinkText}>Sign Up</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.form}>
              <View>
                <View style={[
                  styles.inputContainer,
                  errors.email && styles.inputContainerError
                ]}>
                  <Mail size={20} color={errors.email ? "#F44336" : "#666"} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      clearError('email')
                      setGeneralError(null) // Clear general error when user types
                    }}
                    onBlur={() => {
                      const error = validateEmail(email)
                      if (error) {
                        setErrors(prev => ({ ...prev, email: error }))
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View>
                <View style={[
                  styles.inputContainer,
                  errors.password && styles.inputContainerError
                ]}>
                  <Lock size={20} color={errors.password ? "#F44336" : "#666"} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      clearError('password')
                      setGeneralError(null) // Clear general error when user types
                    }}
                    onBlur={() => {
                      const error = validatePassword(password)
                      if (error) {
                        setErrors(prev => ({ ...prev, password: error }))
                      }
                    }}
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
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
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
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.primaryButtonIconCircle}>
                    <ActivityIndicator color="white" />
                  </View>
                ) : (
                  <View style={styles.primaryButtonIconCircle}>
                    <ArrowRight size={20} color="white" />
                  </View>
                )}
                <View style={styles.primaryButtonTextContainer}>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                  <Text style={styles.primaryButtonSubtext}>Welcome back!</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setMode('signup')
                  setErrors({})
                  setGeneralError(null)
                }}
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#E65100',
    lineHeight: 20,
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
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginTop: 8,
  },
  primaryButtonIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  primaryButtonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  primaryButtonSubtext: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
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
  inputContainerError: {
    borderWidth: 1,
    borderColor: '#F44336',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#F44336',
    marginTop: 4,
    marginLeft: 4,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 3,
    borderLeftColor: '#F44336',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  generalErrorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#C62828',
    lineHeight: 18,
  },
  signUpLink: {
    marginLeft: 4,
  },
  signUpLinkText: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    color: '#F44336',
    textDecorationLine: 'underline',
  },
})