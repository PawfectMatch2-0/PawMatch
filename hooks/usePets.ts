/**
 * usePets Hook - React hook for managing pet data
 */

import { useState, useEffect, useCallback } from 'react';
import { petService, Pet } from '../lib/services/index';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await petService.getAvailablePets();
      setPets(data);
    } catch (err) {
      setError('Failed to fetch pets');
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return {
    pets,
    loading,
    error,
    refetch: fetchPets
  };
};

export const usePetsForSwipe = (userId: string) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await petService.getPetsForSwipe(userId);
      setPets(data);
    } catch (err) {
      setError('Failed to fetch pets');
      console.error('Error fetching pets for swipe:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const recordSwipe = useCallback(async (
    petId: string,
    direction: 'like' | 'pass' | 'super_like'
  ) => {
    if (!userId) return;

    try {
      await petService.recordInteraction(userId, petId, direction);
      // Remove the pet from the list
      setPets(prev => prev.filter(p => p.id !== petId));
    } catch (err) {
      console.error('Error recording swipe:', err);
    }
  }, [userId]);

  return {
    pets,
    loading,
    error,
    refetch: fetchPets,
    recordSwipe
  };
};

export const usePetDetail = (petId: string | null) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await petService.getPetById(petId);
        setPet(data);
      } catch (err) {
        setError('Failed to fetch pet details');
        console.error('Error fetching pet:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return {
    pet,
    loading,
    error
  };
};

export const useFavorites = (userId: string | null) => {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await petService.getUserFavorites(userId);
      setFavorites(data);
    } catch (err) {
      setError('Failed to fetch favorites');
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addToFavorites = useCallback(async (petId: string) => {
    if (!userId) return false;

    try {
      const success = await petService.addToFavorites(userId, petId);
      if (success) {
        await fetchFavorites(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      return false;
    }
  }, [userId, fetchFavorites]);

  const removeFromFavorites = useCallback(async (petId: string) => {
    if (!userId) return false;

    try {
      const success = await petService.removeFromFavorites(userId, petId);
      if (success) {
        setFavorites(prev => prev.filter(p => p.id !== petId));
      }
      return success;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      return false;
    }
  }, [userId]);

  const isFavorited = useCallback(async (petId: string) => {
    if (!userId) return false;
    return await petService.isPetFavorited(userId, petId);
  }, [userId]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited
  };
};

export const useSearchPets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPets = useCallback(async (filters: {
    breed?: string;
    size?: 'small' | 'medium' | 'large';
    gender?: 'male' | 'female';
    location?: string;
    maxAge?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await petService.searchPets(filters);
      setPets(data);
    } catch (err) {
      setError('Failed to search pets');
      console.error('Error searching pets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pets,
    loading,
    error,
    searchPets
  };
};
