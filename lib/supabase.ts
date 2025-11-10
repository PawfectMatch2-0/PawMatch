import { createClient } from '@supabase/supabase-js'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
// IMPORTANT: Import the authenticated Supabase client from enhanced-auth
// This ensures all database operations use the same session
import { supabase as enhancedSupabase } from './enhanced-auth'

// Initialize WebBrowser for mobile auth
WebBrowser.maybeCompleteAuthSession()

// Try to get from Constants.expoConfig.extra first (works on all platforms)
// Falls back to process.env for web
const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Helper function to get the appropriate redirect URI
// Get appropriate redirect URI based on environment - OAuth Engineer Fix
const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    // For web deployment, use your actual domain
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      console.log('🌐 [Auth] Web origin detected:', origin);
      return `${origin}/oauth/callback`;
    }
    return 'http://localhost:8081/oauth/callback';
  }
  
  // For mobile: ALWAYS use auth.expo.io proxy in development
  // This is the ONLY way to make OAuth work reliably with Expo Go
  if (__DEV__) {
    return 'https://auth.expo.io/@yousuf_fahim/pawmatch';
  }
  
  // For production builds, use custom scheme
  return 'pawmatch://oauth/callback';
}

// OAuth Engineer Debug - DISABLED FOR ENHANCED AUTH SYSTEM
if (false && __DEV__ && process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true') {
  console.log('\n📋 [OAuth Engineer] EXACT URIs for Google Console:');
  console.log('✅ https://auth.expo.io/@yousuf_fahim/pawmatch');
  console.log('✅ https://pawfectmatch.expo.app/oauth/callback');
  console.log('✅ http://localhost:8082/oauth/callback');
  console.log('\n🚨 REMOVE ALL OTHER URIs FROM GOOGLE CONSOLE');
  console.log('💡 Current environment URI:', getRedirectUri());
}

// Use the enhanced auth Supabase client which has the active session
// This replaces the old client creation to ensure consistent authentication
const supabaseClient = enhancedSupabase

export const supabase = supabaseClient

// Types for user authentication (matching database schema)
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  phone?: string
  location?: string
  preferences?: {
    provider?: string
    given_name?: string
    family_name?: string
    locale?: string
    email_verified?: boolean
    google_id?: string
    profile_url?: string
    timezone?: string
    last_sign_in_at?: string
    [key: string]: any
  }
  is_admin?: boolean
  created_at: string
  updated_at: string
}

// Pet-related types and functions
export interface Pet {
  id: string
  name: string
  breed: string
  age: number
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  color: string
  personality: string[]
  description: string
  images: string[]
  location: string
  contact_info: any
  adoption_status: 'available' | 'pending' | 'adopted'
  owner_id?: string
  owner?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface LearningArticle {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  subcategory?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  read_time: number
  tags: string[]
  featured_image?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface PetFavorite {
  id: string
  user_id: string
  pet_id: string
  created_at: string
}

export interface PetInteraction {
  id: string
  user_id: string
  pet_id: string
  interaction_type: 'like' | 'pass' | 'super_like'
  created_at: string
}

// Auth utility functions
export const authService = {
  async signInWithGoogle() {
    if (!supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }
    
    const redirectUri = getRedirectUri()
    
    if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true') {
      console.log('🚀 [Auth] Starting Google sign-in with redirect:', redirectUri)
      console.log('🚀 [Auth] Platform:', Platform.OS)
      console.log('🚀 [Auth] Dev mode:', __DEV__)
    }

    // OAuth Engineer Fix: Use the redirect URI directly (no double conversion)
    const actualRedirectUri = redirectUri;
    console.log('🔧 [Auth] Final redirect URI:', actualRedirectUri);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: actualRedirectUri,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: Platform.OS !== 'web'
      },
    })
    
    if (error) throw error
    
    // For web platforms, let Supabase handle the redirect
    if (Platform.OS === 'web') {
      return data
    }
    
    // For mobile platforms, open the auth URL in WebBrowser
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (!data?.url) {
        throw new Error('No authentication URL provided')
      }
      
      console.log('🚀 [Auth] Opening mobile browser for authentication')
      console.log('🚀 [Auth] OAuth URL:', data.url)
      
      // OAuth Engineer Fix: For Expo Go, we need to use the proxy for both directions
      const callbackUri = __DEV__ ? actualRedirectUri : AuthSession.makeRedirectUri({ 
        path: 'oauth/callback'
      });
      
      console.log('🔧 [Auth] WebBrowser callback URI:', callbackUri);
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        callbackUri
      )
      
      console.log('🚀 [Auth] Browser result:', result.type)
      if (result.type === 'success' && result.url) {
        console.log('🚀 [Auth] Success URL:', result.url)
      }
      
      if (result.type === 'success') {
        console.log('✅ [Auth] Browser returned success, processing callback...')
        
        // Parse the callback URL to extract session data
        if (result.url) {
          const url = new URL(result.url)
          const fragment = url.hash.substring(1) // Remove the # character
          const params = new URLSearchParams(fragment)
          
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          
          console.log('🔑 [Auth] Extracted tokens from URL:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken
          })
          
          if (accessToken) {
            // Set the session directly with the tokens
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            })
            
            if (sessionError) {
              console.error('❌ [Auth] Error setting session:', sessionError)
              throw new Error(`Failed to establish session: ${sessionError.message}`)
            }
            
            if (sessionData.session) {
              console.log('✅ [Auth] Session established successfully with user:', sessionData.session.user.email)
              
              // Create or update profile
              await this.createOrUpdateProfile(sessionData.session.user)
              
              return {
                success: true,
                session: sessionData.session,
                user: sessionData.session.user
              }
            }
          }
        }
        
        // Fallback: Try to get existing session
        console.log('🔄 [Auth] Fallback: Checking for existing session...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const { data: session } = await supabase.auth.getSession()
        if (session?.session) {
          console.log('✅ [Auth] Found existing session')
          await this.createOrUpdateProfile(session.session.user)
          return {
            success: true,
            session: session.session,
            user: session.session.user
          }
        }
        
        throw new Error('Authentication completed but no session could be established. Please try again.')
      } else if (result.type === 'cancel') {
        throw new Error('Authentication was cancelled')
      } else {
        throw new Error(`Authentication failed: ${result.type}`)
      }
    }
    
    return data
  },

  async signOut() {
    if (!supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    if (!supabase) return null
    
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data as unknown as UserProfile
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!supabase) {
      throw new Error('Supabase not configured. Please set up your environment variables.')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      // @ts-ignore - Type issues with Supabase generated types
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data as unknown as UserProfile
  },

  async createOrUpdateProfile(user: any): Promise<UserProfile> {
    console.log('📝 [Profile] Starting createOrUpdateProfile for user:', user?.email);
    
    if (!supabase) {
      const error = 'Supabase not configured. Please set up your environment variables.';
      console.error('❌ [Profile]', error);
      throw new Error(error);
    }

    // Test database connection and configuration
    try {
      console.log('🔗 [Profile] Testing database connection...');
      console.log('🔗 [Profile] Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
      console.log('🔗 [Profile] Has anon key:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
      
      // Simple connection test
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('❌ [Profile] Database connection test failed:', testError);
        console.error('❌ [Profile] Error code:', testError.code);
        console.error('❌ [Profile] Error message:', testError.message);
      } else {
        console.log('✅ [Profile] Database connection successful, found', testData?.length || 0, 'profiles');
      }
    } catch (dbTestError) {
      console.error('💥 [Profile] Database test exception:', dbTestError);
    }

    try {
      // Use minimal data that definitely exists in the schema
      const fullName = user.user_metadata?.full_name || 
                       user.user_metadata?.name || 
                       `${user.user_metadata?.given_name || ''} ${user.user_metadata?.family_name || ''}`.trim() || 
                       null;

      // Start with absolutely minimal profile data
      const profileData: any = {
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString()
      };

      // Add optional fields only if they have values
      if (fullName) {
        profileData.full_name = fullName;
      }

      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
      if (avatarUrl) {
        profileData.avatar_url = avatarUrl;
      }

      // Store Google metadata in preferences if the field exists
      const googlePreferences = {
        provider: user.app_metadata?.provider || 'google',
        given_name: user.user_metadata?.given_name || null,
        family_name: user.user_metadata?.family_name || null,
        locale: user.user_metadata?.locale || 'en',
        email_verified: user.user_metadata?.email_verified || user.email_confirmed_at ? true : false,
        google_id: user.user_metadata?.sub || user.user_metadata?.provider_id || null,
        last_sign_in_at: user.last_sign_in_at || new Date().toISOString()
      };

      profileData.preferences = googlePreferences;

      console.log('📝 [Profile] Profile data to upsert:', JSON.stringify(profileData, null, 2));

      // Try to upsert the profile, but don't fail auth if it doesn't work
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .upsert(profileData, {
            onConflict: 'id'
          })
          .select()
          .single()

        if (error) {
          console.error('❌ [Profile] Database upsert error:', error);
          console.error('❌ [Profile] Error code:', error.code);
          console.error('❌ [Profile] Error message:', error.message);
          console.error('❌ [Profile] Error details:', JSON.stringify(error.details, null, 2));
          console.error('❌ [Profile] Profile data attempted:', JSON.stringify(profileData, null, 2));
          
          // Return minimal profile for auth to continue
          console.warn('⚠️ [Profile] Database error - returning minimal profile to continue auth');
          return {
            id: user.id,
            email: user.email,
            full_name: profileData.full_name || null,
            avatar_url: profileData.avatar_url || null,
            preferences: profileData.preferences || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as UserProfile;
        }

        console.log('✅ [Profile] Profile created/updated successfully for:', (data as any)?.email);
        return data as unknown as UserProfile;
        
      } catch (dbError) {
        console.error('💥 [Profile] Database operation failed:', dbError);
        
        // Return minimal profile for auth to continue
        return {
          id: user.id,
          email: user.email,
          full_name: profileData.full_name || null,
          avatar_url: profileData.avatar_url || null,
          preferences: profileData.preferences || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as UserProfile;
      }
      
    } catch (error) {
      console.error('💥 [Profile] Unexpected error:', error);
      
      // Don't let profile errors break auth flow
      console.warn('⚠️ [Profile] Returning minimal profile due to error');
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.picture || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;
    }
  }
}

// Database service functions
export const databaseService = {
  // Pet functions
  async getAvailablePets(limit = 20, offset = 0): Promise<Pet[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('adoption_status', 'available')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching pets:', error)
      return []
    }
    
    return (data as unknown as Pet[]) || []
  },

  async getPetById(id: string): Promise<Pet | null> {
    if (!supabase) return null
    
    // Validate UUID format to prevent database errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn('⚠️ Invalid UUID format for pet ID:', id, '- Skipping database query');
      return null; // Let the caller handle fallback to mock data
    }
    
    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        owner:owner_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('❌ Error fetching pet:', error)
      return null
    }
    
    return data as unknown as Pet
  },

  async getUserPets(userId: string): Promise<Pet[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        owner:owner_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching user pets:', error)
      return []
    }
    
    return (data as unknown as Pet[]) || []
  },

  async addPet(pet: Omit<Pet, 'id' | 'created_at' | 'updated_at'>): Promise<Pet> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('pets')
      // @ts-ignore - Type issues with Supabase generated types
      .insert(pet)
      .select()
      .single()
    
    if (error) throw error
    return data as unknown as Pet
  },

  // Favorites functions
  async getUserFavorites(userId: string): Promise<Pet[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pet_favorites')
      .select(`
        *,
        pet:pet_id (
          *,
          owner:owner_id (
            id,
            email,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching favorites:', error)
      return []
    }
    
    return (data?.map((fav: any) => fav.pet).filter(Boolean) as unknown as Pet[]) || []
  },

  async addToFavorites(userId: string, petId: string): Promise<PetFavorite> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from('pet_favorites')
      // @ts-ignore - Type issues with Supabase generated types
      .insert({ user_id: userId, pet_id: petId })
      .select()
      .single()
    
    if (error) throw error
    return data as unknown as PetFavorite
  },

  async removeFromFavorites(userId: string, petId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase
      .from('pet_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('pet_id', petId)
    
    if (error) throw error
  },

  async isPetFavorited(userId: string, petId: string): Promise<boolean> {
    if (!supabase) return false
    
    const { data, error } = await supabase
      .from('pet_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single()
    
    return !error && !!data
  },

  // Pet interactions (swipe history)
  async recordPetInteraction(userId: string, petId: string, interactionType: 'like' | 'pass' | 'super_like'): Promise<PetInteraction> {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    // Use upsert to handle duplicate interactions gracefully
    const { data, error } = await supabase
      .from('pet_interactions')
      // @ts-ignore - Type issues with Supabase generated types
      .upsert({
        user_id: userId,
        pet_id: petId,
        interaction_type: interactionType
      }, {
        onConflict: 'user_id,pet_id',
        ignoreDuplicates: false // Update existing record instead of ignoring
      })
      .select()
      .single()
    
    if (error) throw error
    return data as unknown as PetInteraction
  },

  /**
   * Get pets for infinite/repeating discover feed
   * 
   * NEW BEHAVIOR: Pets repeat in a loop!
   * - Gets ALL pets where adoption_status = 'available'
   * - Does NOT exclude interacted pets (allows infinite swiping)
   * - Includes user-uploaded pets for all users
   * - Pets will reappear after you swipe through all of them
   * - NOW INCLUDES OWNER DETAILS (name, email, avatar)
   * 
   * @param userId - Current user's ID (for logging)
   * @param limit - Maximum number of pets to return
   */
  async getPetsExcludingInteracted(userId: string, limit = 50): Promise<Pet[]> {
    if (!supabase) {
      console.log('📦 [Database] Supabase not configured, returning empty array')
      return []
    }
    
    try {
      console.log('🔍 [Database] Fetching ALL pets (including adopted) for infinite feed (user:', userId, ')')
      
      // Get ALL pets regardless of adoption status
      const { data: allPets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (petsError) {
        console.error('❌ [Database] Error fetching pets:', petsError.message)
        return []
      }
      
      // Now fetch owner details for each pet
      if (allPets && allPets.length > 0) {
        const petsWithOwners = await Promise.all(
          allPets.map(async (pet) => {
            if (pet.owner_id) {
              const { data: owner, error: ownerError } = await supabase
                .from('user_profiles')
                .select('id, email, full_name, avatar_url')
                .eq('id', pet.owner_id)
                .single()
              
              if (!ownerError && owner) {
                return { ...pet, owner }
              }
            }
            return pet
          })
        )
        
        console.log('📊 [Database] Successfully enriched pets with owner data')
        return petsWithOwners as unknown as Pet[]
      }
      
      // Get interaction count for logging purposes
      const { data: interactions, error: interactionError } = await supabase
        .from('pet_interactions')
        .select('pet_id')
        .eq('user_id', userId)
      
      const interactionCount = interactions?.length || 0
      console.log(`📊 [Database] User has interacted with ${interactionCount} pets (but showing all anyway)`)
      console.log(`✅ [Database] Fetched ${allPets?.length || 0} pets for infinite feed with owner details`)
      
      return (allPets as unknown as Pet[]) || []
    } catch (err) {
      console.error('💥 [Database] Unexpected error in getPetsExcludingInteracted:', err)
      return []
    }
  },

  // Learning articles functions
  async getPublishedArticles(category?: string): Promise<LearningArticle[]> {
    if (!supabase) return []
    
    let query = supabase
      .from('learning_articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching articles:', error)
      return []
    }
    
    return (data as unknown as LearningArticle[]) || []
  },

  async getArticleById(id: string): Promise<LearningArticle | null> {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching article:', error)
      return null
    }
    
    return data as unknown as LearningArticle
  },

  async getArticlesByCategory(category: string): Promise<LearningArticle[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('learning_articles')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }
    
    return (data as unknown as LearningArticle[]) || []
  }
}

export default supabase
