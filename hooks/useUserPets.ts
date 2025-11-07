/**
 * useUserPets Hook
 * React hook for managing user's pet listings
 */

import { useState, useEffect } from 'react';
import { getUserPets, UserPet } from '@/lib/services/userPetsService';
import { useAuth } from '@/hooks/useAuth';

export function useUserPets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getUserPets(user.id);
      
      if (fetchError) {
        setError(fetchError.message || 'Failed to fetch pets');
        setPets([]);
      } else {
        setPets(data || []);
      }
    } catch (err) {
      setError('An error occurred while fetching pets');
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchPets();
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  return {
    pets,
    loading,
    error,
    refetch,
  };
}
