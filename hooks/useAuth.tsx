/**
 * Enhanced Auth Context & Hook
 * Provides authentication state management with JWT validation throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, AuthState, User, AuthSession } from '../lib/enhanced-auth'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
  updateProfile: (updates: Partial<User['user_metadata']>) => Promise<{ success: boolean; error?: string }>
  getAccessToken: () => Promise<string | null>
  refreshSession: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  })

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((state) => {
      console.log('🔐 [AuthContext] State updated:', { 
        user: state.user?.email, 
        loading: state.loading, 
        initialized: state.initialized 
      })
      setAuthState(state)
    })

    return unsubscribe
  }, [])

  // Enhanced auth methods with proper error handling
  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn({ email, password })
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Sign in error:', error)
      return { success: false, error: 'Sign in failed. Please try again.' }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await authService.signUp({ email, password, fullName })
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Sign up error:', error)
      return { success: false, error: 'Sign up failed. Please try again.' }
    }
  }

  const signOut = async () => {
    try {
      const result = await authService.signOut()
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Sign out error:', error)
      return { success: false, error: 'Sign out failed. Please try again.' }
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const result = await authService.forgotPassword({ email })
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Forgot password error:', error)
      return { success: false, error: 'Failed to send reset email. Please try again.' }
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const result = await authService.resendConfirmation(email)
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Resend confirmation error:', error)
      return { success: false, error: 'Failed to resend confirmation. Please try again.' }
    }
  }

  const updateProfile = async (updates: Partial<User['user_metadata']>) => {
    try {
      const result = await authService.updateProfile(updates)
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Update profile error:', error)
      return { success: false, error: 'Failed to update profile. Please try again.' }
    }
  }

  const getAccessToken = async () => {
    try {
      return await authService.getAccessToken()
    } catch (error) {
      console.error('🔐 [AuthContext] Get access token error:', error)
      return null
    }
  }

  const refreshSession = async () => {
    try {
      const result = await authService.refreshSession()
      return result
    } catch (error) {
      console.error('🔐 [AuthContext] Refresh session error:', error)
      return { success: false, error: 'Failed to refresh session.' }
    }
  }

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resendConfirmation,
    updateProfile,
    getAccessToken,
    refreshSession,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth guard hook for protected routes
export function useAuthGuard() {
  const { user, loading, initialized } = useAuth()
  
  return {
    isAuthenticated: !!user,
    isLoading: loading || !initialized,
    user,
  }
}

// JWT token hook for API calls
export function useJWTToken() {
  const { getAccessToken, refreshSession } = useAuth()
  
  const getValidToken = async () => {
    try {
      let token = await getAccessToken()
      
      if (!token) {
        // Try to refresh session
        const refreshResult = await refreshSession()
        if (refreshResult.success) {
          token = await getAccessToken()
        }
      }
      
      return token
    } catch (error) {
      console.error('🔐 [JWT] Get valid token error:', error)
      return null
    }
  }

  return { getValidToken }
}

// Auth status hook for UI components
export function useAuthStatus() {
  const { user, loading, initialized } = useAuth()
  
  return {
    isSignedIn: !!user,
    isLoading: loading,
    isReady: initialized,
    user,
    userEmail: user?.email,
    userName: user?.user_metadata?.full_name,
    userAvatar: user?.user_metadata?.avatar_url,
  }
}