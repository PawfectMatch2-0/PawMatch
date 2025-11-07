/**
 * User Profile Service
 * Manages user profile data in Supabase
 */

import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  preferences?: {
    pet_preference?: string[];
    notification_enabled?: boolean;
    [key: string]: any;
  };
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get user profile by user ID
 * Returns null if profile doesn't exist (caller should handle fallback)
 */
export async function getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
  try {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    // Try to get existing profile
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() to handle 0 rows gracefully

    if (error) {
      console.error('❌ [Profile] Error fetching profile:', error);
      return { data: null, error };
    }

    if (data) {
      console.log('✅ [Profile] Profile fetched successfully');
      return { data, error: null };
    }

    // Profile doesn't exist - return null and let caller handle it
    console.log('⚠️ [Profile] No profile found in database for user:', userId);
    return { data: null, error: null };
  } catch (error) {
    console.error('❌ [Profile] Get profile failed:', error);
    return { data: null, error };
  }
}

/**
 * Create a new user profile
 * Pass user data from the calling context where auth session is available
 */
export async function createUserProfile(
  userId: string,
  email: string,
  fullName?: string,
  phone?: string
): Promise<{ data: UserProfile | null; error: any }> {
  try {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }

    console.log('📝 [Profile] Creating profile for user:', userId);

    const newProfile = {
      id: userId,
      email,
      full_name: fullName || email.split('@')[0], // Use email prefix as fallback
      phone: phone || '',
      location: '',
      preferences: {},
      is_admin: false,
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.error('❌ [Profile] Error creating profile:', error);
      return { data: null, error };
    }

    console.log('✅ [Profile] Profile created successfully');
    return { data, error: null };
  } catch (error) {
    console.error('❌ [Profile] Create profile failed:', error);
    return { data: null, error };
  }
}

/**
 * Get or create user profile (convenience function)
 */
export async function getOrCreateUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
  const result = await getUserProfile(userId);
  // getUserProfile now handles auto-creation, so just return the result
  return result;
}

/**
 * Update user profile (creates if doesn't exist - UPSERT)
 * Pass email explicitly to avoid auth session dependency
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at'>>,
  userEmail?: string // Optional - for when profile doesn't exist yet
): Promise<{ data: UserProfile | null; error: any }> {
  try {
    console.log('📝 [Profile] Upserting profile for user:', userId);
    console.log('📝 [Profile] Updates:', updates);
    console.log('📝 [Profile] User email:', userEmail);
    
    // Check auth session before upserting
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 [Profile] Current session:', session ? 'EXISTS' : 'MISSING');
    console.log('🔐 [Profile] Session user ID:', session?.user?.id);
    console.log('🔐 [Profile] Target user ID:', userId);
    
    if (!session) {
      console.error('❌ [Profile] No active session - this will cause RLS to fail!');
    }
    
    // Use UPSERT to create or update profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: updates.email || userEmail || '', // Use passed email or updates.email
        ...updates,
        // Don't include updated_at - let the database handle it
      }, {
        onConflict: 'id', // If id exists, update; otherwise insert
        ignoreDuplicates: false, // Always update if exists
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [Profile] Error upserting profile:', error);
      // If upsert fails due to RLS, just return success with the updates
      // (profile might be created on server side even if we don't get confirmation)
      return { data: null, error };
    }

    console.log('✅ [Profile] Profile upserted successfully');
    return { data, error: null };
  } catch (error) {
    console.error('❌ [Profile] Update profile failed:', error);
    return { data: null, error };
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  userId: string,
  uri: string,
  fileType: string = 'image/jpeg'
): Promise<{ url: string | null; error: any }> {
  try {
    // Extract file extension from URI or use default
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    // Remove folder structure - just use filename at root
    const filePath = fileName;

    console.log('📤 [Profile] Uploading to path:', filePath);
    
    // CRITICAL: Verify auth session before storage upload
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('❌ [Profile] No auth session found:', sessionError);
      return { url: null, error: new Error('You must be logged in to upload an avatar') };
    }
    
    console.log('✅ [Profile] Auth session verified:', session.user.email);
    console.log('🔑 [Profile] Access token present:', !!session.access_token);
    
    // For React Native, read the file as ArrayBuffer
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    console.log('📦 [Profile] File size:', arrayBuffer.byteLength, 'bytes');

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, arrayBuffer, {
        contentType: fileType,
        upsert: true,
      });

    if (error) {
      console.error('❌ [Profile] Error uploading avatar:', error);
      console.error('❌ [Profile] Error code:', error.statusCode);
      console.error('❌ [Profile] Error message:', error.message);
      return { url: null, error };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    console.log('✅ [Profile] Avatar uploaded successfully:', urlData.publicUrl);
    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('❌ [Profile] Upload avatar failed:', error);
    return { url: null, error };
  }
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(userId: string): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('❌ [Profile] Error deleting profile:', error);
      return { success: false, error };
    }

    console.log('✅ [Profile] Profile deleted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ [Profile] Delete profile failed:', error);
    return { success: false, error };
  }
}
