/**
 * useProfile Hook
 * React hook for managing user profile data
 */

import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/services/profileService';
import { useAuth } from '@/hooks/useAuth';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getUserProfile(user.id);
      
      if (fetchError) {
        setError(fetchError.message || 'Failed to fetch profile');
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError('An error occurred while fetching profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { data, error: updateError } = await updateUserProfile(user.id, updates);
      
      if (updateError) {
        return { success: false, error: updateError.message || 'Failed to update profile' };
      }
      
      setProfile(data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'An error occurred while updating profile' };
    }
  };

  const refetch = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch,
  };
}
