/**
 * Email Confirmation Handler
 * Handles email confirmation from Supabase auth links
 */

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { CheckCircle, XCircle, Heart } from 'lucide-react-native'
import { supabase } from '../../lib/enhanced-auth'
import { COLORS } from '@/constants/theme'

export default function EmailConfirm() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout | null = null

    const confirmEmail = async () => {
      try {
        console.log('📧 [Email Confirm] Received params:', params)
        
        // Set a timeout to prevent infinite loading (10 seconds)
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('⏱️ [Email Confirm] Timeout - checking if user is already signed in')
            // Check if user is already signed in (fallback)
            checkIfAlreadySignedIn()
          }
        }, 10000)
        
        // Check for tokens in URL hash (web) or query params (mobile)
        let access_token: string | null = null
        let refresh_token: string | null = null
        let type: string | null = null
        let token: string | null = null

        // Try query params first (mobile/Expo deep links)
        if (params.access_token) {
          access_token = params.access_token as string
          refresh_token = params.refresh_token as string
          type = params.type as string
        }
        
        // Try hash params (web)
        if (typeof window !== 'undefined' && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          access_token = hashParams.get('access_token') || access_token
          refresh_token = hashParams.get('refresh_token') || refresh_token
          type = hashParams.get('type') || type
        }
        
        // Try token parameter (Supabase email confirmation format)
        if (params.token) {
          token = params.token as string
          type = params.type as string || 'signup'
        }

        console.log('📧 [Email Confirm] Extracted:', { 
          hasAccessToken: !!access_token, 
          hasRefreshToken: !!refresh_token,
          hasToken: !!token,
          type 
        })

        // Method 1: If we have access_token and refresh_token, use setSession
        if (access_token && refresh_token) {
          console.log('📧 [Email Confirm] Using setSession method')
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (error) {
            console.error('❌ [Email Confirm] setSession error:', error)
            if (isMounted) {
              setStatus('error')
              setMessage(error.message || 'Email confirmation failed')
            }
            return
          }

          if (data.user && isMounted) {
            console.log('✅ [Email Confirm] Email confirmed successfully via setSession')
            if (timeoutId) clearTimeout(timeoutId)
            await handleSuccessfulConfirmation(data.user)
            return
          }
        }

        // Method 2: If we have token parameter, use verifyOtp (proper Supabase method)
        if (token && type) {
          console.log('📧 [Email Confirm] Using verifyOtp method')
          
          // Extract email from token or params
          const email = params.email as string
          
          if (!email) {
            console.error('❌ [Email Confirm] No email found for verifyOtp')
            if (isMounted) {
              setStatus('error')
              setMessage('Email address not found in confirmation link')
            }
            return
          }

          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: type as 'signup' | 'email',
          })

          if (error) {
            console.error('❌ [Email Confirm] verifyOtp error:', error)
            if (isMounted) {
              setStatus('error')
              setMessage(error.message || 'Email confirmation failed. The link may have expired.')
            }
            return
          }

          if (data.user && isMounted) {
            console.log('✅ [Email Confirm] Email confirmed successfully via verifyOtp')
            if (timeoutId) clearTimeout(timeoutId)
            await handleSuccessfulConfirmation(data.user)
            return
          }
        }

        // Method 3: Check if user is already signed in (mobile deep link might have already processed)
        await checkIfAlreadySignedIn()

      } catch (error: any) {
        console.error('❌ [Email Confirm] Exception:', error)
        if (isMounted) {
          setStatus('error')
          setMessage(error?.message || 'Email confirmation failed. Please try again.')
        }
      }
    }

    const checkIfAlreadySignedIn = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session?.user && isMounted) {
          console.log('✅ [Email Confirm] User already signed in:', session.user.email)
          if (timeoutId) clearTimeout(timeoutId)
          await handleSuccessfulConfirmation(session.user)
          return
        }
        
        // If no tokens found and no session, show error
        if (isMounted && !params.access_token && !params.token && !session) {
          console.warn('⚠️ [Email Confirm] No valid tokens found in URL')
          setStatus('error')
          setMessage('The confirmation link format was invalid. Your email may still be confirmed. Please try signing in. If sign-in fails, request a new confirmation email.')
        }
      } catch (error) {
        console.error('❌ [Email Confirm] Error checking session:', error)
      }
    }

    const handleSuccessfulConfirmation = async (user: any) => {
      if (!isMounted) return
      
      // Auto-create profile if it doesn't exist
      console.log('📝 [Confirm] Checking/creating profile for user:', user.id)
      try {
        const { createUserProfile } = await import('@/lib/services/profileService')
        await createUserProfile(
          user.id,
          user.email || '',
          user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user.user_metadata?.phone || ''
        )
        console.log('✅ [Confirm] Profile setup complete')
      } catch (profileError) {
        console.warn('⚠️ [Confirm] Profile creation error (non-critical):', profileError)
      }
      
      if (isMounted) {
        setStatus('success')
        setMessage('Your email has been confirmed! Welcome to PawfectMatch 2.0.')

        // Redirect to discover page immediately (no delay needed)
        // Use requestAnimationFrame to ensure UI updates first
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (isMounted) {
              router.replace('/(tabs)')
            }
          }, 800) // Reduced from 1500ms to 800ms for faster redirect
        })
      }
    }

    confirmEmail()

    // Cleanup
    return () => {
      isMounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [params, router])

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <View style={styles.iconContainer}>
              <CheckCircle size={80} color="#4CAF50" />
            </View>
            <Text style={styles.title}>Email Confirmed! 🎉</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subtitle}>Redirecting to app...</Text>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </>
        )

      case 'error':
        return (
          <>
            <View style={styles.iconContainer}>
              <XCircle size={80} color="#F44336" />
            </View>
            <Text style={styles.title}>Confirmation Failed</Text>
            <Text style={styles.message}>{message}</Text>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/auth-enhanced')}
            >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </>
        )

      default: // loading
        return (
          <>
            <View style={styles.iconContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Confirming Email...</Text>
            <Text style={styles.message}>Please wait while we confirm your email address.</Text>
          </>
        )
    }
  }

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.primaryLight, COLORS.primaryLighter]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.pawLogo}>🐾</Text>
            </View>
            <Text style={styles.appName}>PawfectMatch 2.0</Text>
          </View>

          <View style={styles.card}>
            {renderContent()}
          </View>
        </View>
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
  pawLogo: {
    fontSize: 36,
    textAlign: 'center',
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
})