/**
 * User Pets Service
 * Manages user-uploaded pets in Supabase
 */

import { supabase } from '../supabase';

export interface UserPet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color?: string;
  personality?: string[];
  description?: string;
  images?: string[];
  location?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    preferred_contact?: string;
  };
  adoption_status: 'available' | 'pending' | 'adopted';
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePetData {
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color?: string;
  personality?: string[];
  description?: string;
  images?: string[];
  location?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    preferred_contact?: string;
  };
}

/**
 * Get all pets uploaded by a specific user
 */
export async function getUserPets(userId: string): Promise<{ data: UserPet[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [UserPets] Error fetching user pets:', error);
      return { data: null, error };
    }

    console.log(`✅ [UserPets] Fetched ${data?.length || 0} pets for user`);
    return { data, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Fetch user pets failed:', error);
    return { data: null, error };
  }
}

/**
 * Create a new pet listing
 */
export async function createUserPet(
  userId: string,
  petData: CreatePetData
): Promise<{ data: UserPet | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pets')
      .insert([
        {
          ...petData,
          owner_id: userId,
          adoption_status: 'available',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ [UserPets] Error creating pet:', error);
      return { data: null, error };
    }

    console.log('✅ [UserPets] Pet created successfully:', data.name);
    return { data, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Create pet failed:', error);
    return { data: null, error };
  }
}

/**
 * Update a pet listing
 */
export async function updateUserPet(
  petId: string,
  updates: Partial<CreatePetData>
): Promise<{ data: UserPet | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', petId)
      .select()
      .single();

    if (error) {
      console.error('❌ [UserPets] Error updating pet:', error);
      return { data: null, error };
    }

    console.log('✅ [UserPets] Pet updated successfully');
    return { data, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Update pet failed:', error);
    return { data: null, error };
  }
}

/**
 * Delete a pet listing
 */
export async function deleteUserPet(petId: string): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId);

    if (error) {
      console.error('❌ [UserPets] Error deleting pet:', error);
      return { success: false, error };
    }

    console.log('✅ [UserPets] Pet deleted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Delete pet failed:', error);
    return { success: false, error };
  }
}

/**
 * Upload pet images to Supabase Storage
 * Note: For React Native, we need to use FormData with ArrayBuffer
 */
export async function uploadPetImages(
  petId: string,
  imageUris: string[]
): Promise<{ urls: string[]; error: any }> {
  try {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${petId}-${Date.now()}-${i}.${fileExt}`;
      const filePath = `pet-images/${fileName}`;

      // For React Native, fetch and convert to ArrayBuffer
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      
      // Convert ArrayBuffer to Uint8Array for Supabase
      const fileData = new Uint8Array(arrayBuffer);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(filePath, fileData, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) {
        console.error('❌ [UserPets] Error uploading image:', uploadError);
        console.error('❌ [UserPets] Upload error details:', uploadError.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pet-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
      console.log(`✅ [UserPets] Image ${i + 1}/${imageUris.length} uploaded`);
    }

    console.log(`✅ [UserPets] Uploaded ${uploadedUrls.length}/${imageUris.length} images successfully`);
    return { urls: uploadedUrls, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Upload images failed:', error);
    return { urls: [], error };
  }
}

/**
 * Update pet adoption status
 */
export async function updatePetStatus(
  petId: string,
  status: 'available' | 'pending' | 'adopted'
): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from('pets')
      .update({ adoption_status: status })
      .eq('id', petId);

    if (error) {
      console.error('❌ [UserPets] Error updating status:', error);
      return { success: false, error };
    }

    console.log('✅ [UserPets] Pet status updated to:', status);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ [UserPets] Update status failed:', error);
    return { success: false, error };
  }
}
