/**
 * Enhanced JWT Authentication with Forgot Password - PRODUCTION READY
 * Features: JWT tokens, password reset, email verification, secure session management
 * Environment-aware configuration for development vs production
 * NO OAUTH - Clean implementation focused on reliability
 */

import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Environment detection
const isDevelopment = process.env.APP_ENV !== 'production'
const isDebugMode = process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true'

// Validate environment variables first
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your_supabase_url_here') || 
    supabaseAnonKey.includes('your_supabase_anon_key_here')) {
  console.warn('⚠️ Supabase environment variables not configured. Auth will not work.')
}

// Enhanced Supabase client with JWT configuration - NO OAUTH
export const supabase = (supabaseUrl && supabaseAnonKey && 
                         !supabaseUrl.includes('your_supabase_url_here') && 
                         !supabaseAnonKey.includes('your_supabase_anon_key_here'))
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable OAuth URL detection
      },
    })
  : null

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured. Auth operations will not work.')
    return false
  }
  return true
}

if (isDevelopment && isDebugMode) {
  console.log('🔐 [Auth] Enhanced JWT auth service initialized (DEVELOPMENT MODE)')
} else {
  console.log('🔐 [Auth] Enhanced JWT auth service initialized (PRODUCTION MODE)')
}

// Get proper redirect URLs for email links
const getEmailRedirectUrl = (path: string) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      return `${origin}${path}`
    }
    // Development fallback
    if (isDevelopment) {
      return `http://localhost:8082${path}`
    }
    // Production web URL
    return `${process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || 'https://yourdomain.com'}${path}`
  }
  
  // For mobile, use custom scheme
  const scheme = process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL || 'pawmatch://auth-callback'
  return scheme.replace('auth-callback', path.replace('/', ''))
}

// Auth types
export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  created_at: string
  updated_at: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    [key: string]: any
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  user: User
  expires_in: number
  expires_at?: number
}

export interface AuthState {
  user: User | null
  session: AuthSession | null
  loading: boolean
  initialized: boolean
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
  token: string
}

// Auth service class
class AuthService {
  private authState: AuthState = {
    user: null,
    session: null,
    loading: false,
    initialized: false
  }
  
  private listeners: ((state: AuthState) => void)[] = []

  constructor() {
    this.initialize()
  }

  // Initialize auth service
  private async initialize() {
    try {
      this.setLoading(true)
      
      if (!isSupabaseConfigured()) {
        this.updateAuthState({ user: null, session: null, loading: false, initialized: true })
        return
      }
      
      // Check for existing session
      const { data: { session }, error } = await supabase!.auth.getSession()
      
      if (error) {
        console.error('🔐 [Auth] Session initialization error:', error)
        this.updateAuthState({ user: null, session: null, loading: false, initialized: true })
        return
      }

      if (session) {
        console.log('🔐 [Auth] Found existing session for:', session.user.email)
        this.updateAuthState({
          user: session.user as User,
          session: session as AuthSession,
          loading: false,
          initialized: true
        })
      } else {
        console.log('🔐 [Auth] No existing session found')
        this.updateAuthState({ user: null, session: null, loading: false, initialized: true })
      }

      // Listen for auth changes
      supabase!.auth.onAuthStateChange((event, session) => {
        console.log('🔐 [Auth] State change:', event, session?.user?.email)
        
        if (session) {
          this.updateAuthState({
            user: session.user as User,
            session: session as AuthSession,
            loading: false,
            initialized: true
          })
        } else {
          this.updateAuthState({ 
            user: null, 
            session: null, 
            loading: false, 
            initialized: true 
          })
        }
      })

    } catch (error) {
      console.error('🔐 [Auth] Initialization failed:', error)
      this.updateAuthState({ user: null, session: null, loading: false, initialized: true })
    }
  }

  // Update auth state and notify listeners
  private updateAuthState(newState: Partial<AuthState>) {
    this.authState = { ...this.authState, ...newState }
    this.listeners.forEach(listener => listener(this.authState))
  }

  // Set loading state
  private setLoading(loading: boolean) {
    this.updateAuthState({ loading })
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    // Immediately call with current state
    listener(this.authState)
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Get current auth state
  getState(): AuthState {
    return this.authState
  }

  // Sign up with email and password
  async signUp(data: SignUpData) {
    try {
      this.setLoading(true)
      
      const redirectUrl = getEmailRedirectUrl('/auth/confirm')
      console.log('🔐 [Auth] Sign up with email redirect:', redirectUrl)
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
          },
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        // Development fallback for email service issues
        if (isDevelopment && isDebugMode && error.message.includes('Error sending confirmation email')) {
          console.warn('🚧 [Auth] Email service not configured - using development mode')
          console.log('📧 [Auth] Development: Confirmation email would be sent to:', data.email)
          
          this.setLoading(false)
          return { 
            success: true, 
            message: `Development Mode: Account created. Email confirmation logged to console.` 
          }
        }
        
        console.error('🔐 [Auth] Sign up error:', error)
        this.setLoading(false)
        
        // Production-friendly error message
        if (!isDevelopment) {
          return { success: false, error: 'Unable to create account. Please try again later.' }
        }
        
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Sign up successful:', authData.user?.email)
      
      // Check if email confirmation is required
      if (!authData.session && authData.user) {
        this.setLoading(false)
        return { 
          success: true, 
          requiresEmailConfirmation: true,
          message: 'Please check your email to confirm your account'
        }
      }

      this.setLoading(false)
      return { success: true, user: authData.user }

    } catch (error) {
      console.error('🔐 [Auth] Sign up failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Sign up failed. Please try again.' }
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData) {
    try {
      this.setLoading(true)
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        console.error('🔐 [Auth] Sign in error:', error)
        this.setLoading(false)
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Sign in successful:', authData.user?.email)
      this.setLoading(false)
      return { success: true, user: authData.user, session: authData.session }

    } catch (error) {
      console.error('🔐 [Auth] Sign in failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Sign in failed. Please try again.' }
    }
  }

  // Request password reset
  async forgotPassword(data: ForgotPasswordData) {
    try {
      this.setLoading(true)
      
      const redirectUrl = getEmailRedirectUrl('/auth/reset-password')
      console.log('🔐 [Auth] Password reset with email redirect:', redirectUrl)
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl
      })

      if (error) {
        // Development fallback for email service issues
        if (isDevelopment && isDebugMode && error.message.includes('Error sending recovery email')) {
          console.warn('🚧 [Auth] Email service not configured - using development mode')
          console.log('📧 [Auth] Development: Password reset email would be sent to:', data.email)
          console.log('🔗 [Auth] Development: Reset URL would be:', redirectUrl)
          
          this.setLoading(false)
          return { 
            success: true, 
            message: `Development Mode: Password reset link logged to console for ${data.email}` 
          }
        }
        
        console.error('🔐 [Auth] Forgot password error:', error)
        this.setLoading(false)
        
        // Production-friendly error message
        if (!isDevelopment) {
          return { success: false, error: 'Unable to send reset email. Please try again later.' }
        }
        
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Password reset email sent to:', data.email)
      this.setLoading(false)
      return { 
        success: true, 
        message: 'Password reset email sent. Please check your inbox.' 
      }

    } catch (error) {
      console.error('🔐 [Auth] Forgot password failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Failed to send reset email. Please try again.' }
    }
  }

  // Reset password with token
  async resetPassword(data: ResetPasswordData) {
    try {
      this.setLoading(true)
      
      const { data: authData, error } = await supabase.auth.updateUser({
        password: data.password
      })

      if (error) {
        console.error('🔐 [Auth] Reset password error:', error)
        this.setLoading(false)
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Password reset successful')
      this.setLoading(false)
      return { success: true, message: 'Password updated successfully' }

    } catch (error) {
      console.error('🔐 [Auth] Reset password failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Failed to reset password. Please try again.' }
    }
  }

  // Sign out
  async signOut() {
    try {
      this.setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('🔐 [Auth] Sign out error:', error)
        this.setLoading(false)
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Sign out successful')
      this.setLoading(false)
      return { success: true }

    } catch (error) {
      console.error('🔐 [Auth] Sign out failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Sign out failed' }
    }
  }

  // Resend email confirmation
  async resendConfirmation(email: string) {
    try {
      this.setLoading(true)
      
      const redirectUrl = getEmailRedirectUrl('/auth/confirm')
      console.log('🔐 [Auth] Resend confirmation with email redirect:', redirectUrl)
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        console.error('🔐 [Auth] Resend confirmation error:', error)
        this.setLoading(false)
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Confirmation email resent to:', email)
      this.setLoading(false)
      return { success: true, message: 'Confirmation email sent' }

    } catch (error) {
      console.error('🔐 [Auth] Resend confirmation failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Failed to resend confirmation email' }
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User['user_metadata']>) {
    try {
      this.setLoading(true)
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        console.error('🔐 [Auth] Update profile error:', error)
        this.setLoading(false)
        return { success: false, error: error.message }
      }

      console.log('🔐 [Auth] Profile updated successfully')
      this.setLoading(false)
      return { success: true, user: data.user }

    } catch (error) {
      console.error('🔐 [Auth] Update profile failed:', error)
      this.setLoading(false)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Get JWT token
  async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    } catch (error) {
      console.error('🔐 [Auth] Get access token failed:', error)
      return null
    }
  }

  // Refresh session
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('🔐 [Auth] Refresh session error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, session: data.session }
    } catch (error) {
      console.error('🔐 [Auth] Refresh session failed:', error)
      return { success: false, error: 'Failed to refresh session' }
    }
  }
}

// Create singleton instance
export const authService = new AuthService()

// Export convenience functions
export const {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  resendConfirmation,
  updateProfile,
  getAccessToken,
  refreshSession,
  subscribe: subscribeToAuth,
  getState: getAuthState
} = authService
