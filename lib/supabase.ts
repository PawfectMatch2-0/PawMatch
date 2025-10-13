import { createClient } from '@supabase/supabase-js'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

// Initialize WebBrowser for mobile auth
WebBrowser.maybeCompleteAuthSession()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Helper function to get the appropriate redirect URI
const getRedirectUri = () => {
  // Always use AuthSession.makeRedirectUri() for mobile - it handles Expo Go vs standalone correctly
  return AuthSession.makeRedirectUri({
    scheme: __DEV__ ? undefined : 'pawmatch',
    path: 'oauth/callback'
  })
}

// Debug logging for redirect URIs (only in development)
if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true') {
  console.log('\n📋 [Google Console] Add these Redirect URIs:');
  console.log('- Current redirect URI:', getRedirectUri());
  console.log('- Expo Go:', AuthSession.makeRedirectUri({ path: 'oauth/callback' }));
  console.log('- Alternative Dev:', 'https://auth.expo.io/@yousuf_fahim/pawmatch');
  console.log('- Production (EAS Build):', AuthSession.makeRedirectUri({ scheme: 'pawmatch', path: 'oauth/callback' }));
  console.log('- Alternative Production:', 'pawmatch://oauth/callback');
}

// Check if environment variables are configured and create client
let supabaseClient: ReturnType<typeof createClient> | null = null

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your_supabase_url_here') || 
    supabaseAnonKey.includes('your_supabase_anon_key_here')) {
  console.warn('⚠️ Supabase environment variables not configured. Using mock data.')
  supabaseClient = null
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      detectSessionInUrl: false, // Prevents issues with React Native
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

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

    // ARCHITECTURAL FIX: For Expo Go development, use a registered redirect URI
    let actualRedirectUri = redirectUri;
    if (__DEV__ && redirectUri.startsWith('exp://')) {
      // Use the auth.expo.io proxy which is pre-registered with Google
      actualRedirectUri = `https://auth.expo.io/@yousuf_fahim/pawmatch`;
      console.log('🔧 [Auth] Using Expo proxy for development:', actualRedirectUri);
    }
    
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
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri  // Use original redirectUri for deep link back to app
      )
      
      console.log('🚀 [Auth] Browser result:', result.type)
      if (result.type === 'success' && result.url) {
        console.log('🚀 [Auth] Success URL:', result.url)
      }
      
      if (result.type === 'success') {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Try multiple times to get session
        for (let i = 0; i < 3; i++) {
          const { data: session } = await supabase.auth.getSession()
          if (session?.session) {
            console.log('✅ [Auth] Session established successfully')
            return {
              success: true,
              session: session.session,
              user: session.session.user
            }
          }
          console.log(`🔄 [Auth] Waiting for session... attempt ${i + 1}`)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        throw new Error('Authentication completed but no session found after multiple attempts')
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
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching pet:', error)
      return null
    }
    
    return data as unknown as Pet
  },

  async getUserPets(userId: string): Promise<Pet[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
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
        pet:pet_id (*)
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
    
    const { data, error } = await supabase
      .from('pet_interactions')
      // @ts-ignore - Type issues with Supabase generated types
      .insert({
        user_id: userId,
        pet_id: petId,
        interaction_type: interactionType
      })
      .select()
      .single()
    
    if (error) throw error
    return data as unknown as PetInteraction
  },

  async getPetsExcludingInteracted(userId: string, limit = 20): Promise<Pet[]> {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('adoption_status', 'available')
      .not('id', 'in', `(
        SELECT pet_id FROM pet_interactions WHERE user_id = '${userId}'
      )`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching uninteracted pets:', error)
      return []
    }
    
    return (data as unknown as Pet[]) || []
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
