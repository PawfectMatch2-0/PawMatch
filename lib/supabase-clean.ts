/**
 * CLEAN SUPABASE CLIENT - No OAuth, Pure JWT Authentication
 * Optimized for enhanced auth system with proper email configuration
 */

import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Clean Supabase client configuration - NO OAUTH
export const supabase = createClient(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disable OAuth URL detection
    },
  }
)

// Environment validation
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 [Supabase] Missing environment variables!')
  console.error('Please check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY')
}

// Enhanced auth configuration status
console.log('🔐 [Supabase] Enhanced JWT auth client initialized')
console.log('📧 [Supabase] Email service ready for authentication')

// Export types for enhanced authentication
export interface DatabaseUser {
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

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  location?: string
  preferences?: Record<string, any>
  is_admin?: boolean
  created_at: string
  updated_at: string
}

// Pet adoption related types
export interface Pet {
  id: string
  name: string
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  color: string
  description: string
  personality: string[]
  images: string[]
  location: string
  shelter_id?: string
  status: 'available' | 'pending' | 'adopted'
  created_at: string
  updated_at: string
}

export interface AdoptionApplication {
  id: string
  user_id: string
  pet_id: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed'
  application_data: {
    personal_info: {
      full_name: string
      phone: string
      address: string
      age: number
    }
    living_situation: {
      housing_type: string
      owns_home: boolean
      has_yard: boolean
      other_pets: string[]
    }
    experience: {
      previous_pets: string
      veterinarian_info?: string
      references?: string[]
    }
  }
  submitted_at: string
  reviewed_at?: string
  completed_at?: string
}

// Utility functions for database operations
export const dbHelpers = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('🚨 [DB] Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('🚨 [DB] Error in getUserProfile:', error)
      return null
    }
  },

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile)
        .select()
        .single()

      if (error) {
        console.error('🚨 [DB] Error upserting user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('🚨 [DB] Error in upsertUserProfile:', error)
      return null
    }
  },

  // Get available pets
  async getAvailablePets(limit = 50): Promise<Pet[]> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('🚨 [DB] Error fetching pets:', error)
        return []
      }

      return data as Pet[]
    } catch (error) {
      console.error('🚨 [DB] Error in getAvailablePets:', error)
      return []
    }
  },

  // Submit adoption application
  async submitAdoptionApplication(application: Omit<AdoptionApplication, 'id' | 'submitted_at'>): Promise<AdoptionApplication | null> {
    try {
      const { data, error } = await supabase
        .from('adoption_applications')
        .insert({
          ...application,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('🚨 [DB] Error submitting adoption application:', error)
        return null
      }

      return data as AdoptionApplication
    } catch (error) {
      console.error('🚨 [DB] Error in submitAdoptionApplication:', error)
      return null
    }
  },

  // Get user's adoption applications
  async getUserAdoptionApplications(userId: string): Promise<AdoptionApplication[]> {
    try {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select(`
          *,
          pets (
            id,
            name,
            breed,
            images
          )
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error('🚨 [DB] Error fetching adoption applications:', error)
        return []
      }

      return data as AdoptionApplication[]
    } catch (error) {
      console.error('🚨 [DB] Error in getUserAdoptionApplications:', error)
      return []
    }
  }
}

// Email configuration validation
export const validateEmailConfig = async () => {
  try {
    // Test basic Supabase connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error && error.message.includes('Invalid API key')) {
      console.error('🚨 [Email] Invalid Supabase API key')
      return false
    }

    console.log('✅ [Email] Supabase connection validated')
    return true
  } catch (error) {
    console.error('🚨 [Email] Configuration validation failed:', error)
    return false
  }
}

// Initialize and validate configuration
validateEmailConfig()