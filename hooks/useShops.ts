/**
 * useShops Hook - React hook for managing pet shop/service data
 */

import { useState, useEffect, useCallback } from 'react';
import { shopService, PetShop } from '../lib/services/index';

export const useShops = () => {
  const [shops, setShops] = useState<PetShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getAllShops();
      setShops(data);
    } catch (err) {
      setError('Failed to fetch shops');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return {
    shops,
    loading,
    error,
    refetch: fetchShops
  };
};

export const useShopsByType = (type: 'shelter' | 'veterinary' | 'grooming' | 'training' | 'pet_store' | 'daycare') => {
  const [shops, setShops] = useState<PetShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getShopsByType(type);
      setShops(data);
    } catch (err) {
      setError('Failed to fetch shops');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return {
    shops,
    loading,
    error,
    refetch: fetchShops
  };
};

export const useShopDetail = (shopId: string | null) => {
  const [shop, setShop] = useState<PetShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await shopService.getShopById(shopId);
        setShop(data);
      } catch (err) {
        setError('Failed to fetch shop details');
        console.error('Error fetching shop:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  return {
    shop,
    loading,
    error
  };
};

export const useVerifiedShops = () => {
  const [shops, setShops] = useState<PetShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getVerifiedShops();
      setShops(data);
    } catch (err) {
      setError('Failed to fetch verified shops');
      console.error('Error fetching verified shops:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  return {
    shops,
    loading,
    error,
    refetch: fetchShops
  };
};

export const useSearchShops = () => {
  const [shops, setShops] = useState<PetShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchShops = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.searchShops(searchTerm);
      setShops(data);
    } catch (err) {
      setError('Failed to search shops');
      console.error('Error searching shops:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getShopsByLocation(location);
      setShops(data);
    } catch (err) {
      setError('Failed to search by location');
      console.error('Error searching by location:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByService = useCallback(async (service: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getShopsByService(service);
      setShops(data);
    } catch (err) {
      setError('Failed to search by service');
      console.error('Error searching by service:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shops,
    loading,
    error,
    searchShops,
    searchByLocation,
    searchByService
  };
};
