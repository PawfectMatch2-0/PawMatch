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

export default function EmailConfirm() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Extract tokens from URL params
        const { access_token, refresh_token, type } = params

        if (type !== 'signup' || !access_token || !refresh_token) {
          setStatus('error')
          setMessage('Invalid confirmation link')
          return
        }

        // Set the session with the tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: access_token as string,
          refresh_token: refresh_token as string,
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          setMessage(error.message || 'Email confirmation failed')
          return
        }

        console.log('✅ Email confirmed successfully')
        setStatus('success')
        setMessage('Your email has been confirmed! Welcome to PawMatch.')

        // Redirect to app after a delay
        setTimeout(() => {
          router.replace('/(tabs)')
        }, 2000)

      } catch (error) {
        console.error('Email confirmation failed:', error)
        setStatus('error')
        setMessage('Email confirmation failed. Please try again.')
      }
    }

    confirmEmail()
  }, [params, router])

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <View style={styles.iconContainer}>
              <CheckCircle size={80} color="#4CAF50" />
            </View>
            <Text style={styles.title}>Email Confirmed!</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subtitle}>Redirecting to app...</Text>
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
              <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
            <Text style={styles.title}>Confirming Email...</Text>
            <Text style={styles.message}>Please wait while we confirm your email address.</Text>
          </>
        )
    }
  }

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
    backgroundColor: '#FF6B6B',
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