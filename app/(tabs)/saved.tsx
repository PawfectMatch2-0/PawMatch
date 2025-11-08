import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Heart, MapPin, MessageCircle, User } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState, { NoSavedPetsEmptyState } from '@/components/ui/EmptyState';
import { supabase, databaseService, Pet } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';



export default function SavedScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Get user from auth context
  const [savedPets, setSavedPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedPets();
  }, []);

  // Refresh saved pets when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedPets();
    }, [])
  );

  const loadSavedPets = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔄 [Saved] Loading saved pets...');
      console.log('👤 [Saved] Current user:', user?.email || 'Not logged in');
      
      if (user && supabase) {
        // Load user's favorite pets from database
        console.log('📊 [Saved] Loading favorites from database for user:', user.id);
        const favorites = await databaseService.getUserFavorites(user.id);
        console.log('✅ [Saved] Loaded', favorites.length, 'favorite pets from database');
        setSavedPets(favorites);
      } else {
        // Empty list if not logged in (no mock data fallback)
        console.log('⚠️ [Saved] User not logged in or Supabase not configured - showing empty list');
        setSavedPets([]);
      }
    } catch (error) {
      console.error('❌ [Saved] Error loading saved pets:', error);
      // Show empty list on error instead of mock data
      setSavedPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert mock pets to database format (same function as in index.tsx)
  const convertMockPetsToDBFormat = (mockPets: any[]): Pet[] => {
    return mockPets.map(pet => ({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age, // Keep the original age string (e.g., "4 months", "2 years")
      gender: pet.gender.toLowerCase() as 'male' | 'female',
      size: pet.size.toLowerCase() as 'small' | 'medium' | 'large',
      color: 'Mixed',
      personality: pet.personality || [],
      description: pet.description || 'A wonderful pet looking for a loving home.',
      images: pet.image ? [pet.image] : [],
      location: pet.location || 'Unknown',
      contact_info: { shelter: 'Local Shelter', phone: '(555) 123-4567' },
      adoption_status: 'available' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  };

  const handleRemoveFromFavorites = async (petId: string) => {
    if (user && supabase) {
      try {
        await databaseService.removeFromFavorites(user.id, petId);
        // Update local state
        setSavedPets(prev => prev.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      // Just update local state for mock data
      setSavedPets(prev => prev.filter(pet => pet.id !== petId));
    }
  };

  const handlePetPress = (petId: string) => {
    router.push({
      pathname: '/pet/[id]',
      params: { id: petId }
    });
  };

  const handleMessage = async (petId: string) => {
    const pet = savedPets.find(p => p.id === petId);
    if (pet) {
      try {
        // Get contact info from pet's database record
        let phoneNumber = pet.contact_info?.phone || pet.contact_info?.whatsapp;
        
        // If no contact in pet record, try to get owner's phone from profile
        if (!phoneNumber && pet.owner_id && supabase) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('phone')
            .eq('id', pet.owner_id)
            .single();
          
          if (profileData?.phone) {
            phoneNumber = profileData.phone;
          }
        }
        
        if (!phoneNumber) {
          Alert.alert('Contact Unavailable', 'No contact information available for this pet.');
          return;
        }
        
        // Clean the phone number (remove spaces, dashes, etc.)
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        
        const message = `Hi! I'm interested in ${pet.name}, a ${pet.breed}. Could you please provide more information?`;
        const whatsappUrl = `whatsapp://send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
        
        const supported = await Linking.canOpenURL(whatsappUrl);
        if (supported) {
          await Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('WhatsApp not installed', 'Please install WhatsApp to send messages.');
        }
      } catch (error) {
        console.error('Error opening WhatsApp:', error);
        Alert.alert('Error', 'Unable to open WhatsApp. Please try again.');
      }
    }
  };

  const renderPetItem = ({ item }: { item: Pet }) => (
    <TouchableOpacity style={styles.petCard} onPress={() => handlePetPress(item.id)}>
      <Image 
        source={{ 
          uri: item.images && item.images.length > 0 
            ? item.images[0] 
            : 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'
        }} 
        style={styles.petImage} 
      />
      <View style={styles.petInfo}>
        <View style={styles.petHeader}>
          <Text style={styles.petName}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleRemoveFromFavorites(item.id)}>
            <Heart size={20} color={COLORS.primary} fill={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.petBreed}>{item.breed} • {item.age} {item.age === 1 ? 'year' : 'years'} old</Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color="#666" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.personalityTags}>
          {item.personality.slice(0, 2).map((trait, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{trait}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={(e) => {
              e.stopPropagation();
              const url = `https://maps.google.com/?q=${encodeURIComponent(item.location)}`;
              Linking.openURL(url).catch(err => 
                console.error('Error opening maps:', err)
              );
            }}
          >
            <MapPin size={16} color="white" />
            <Text style={styles.locationButtonText}>Track Location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={(e) => {
              e.stopPropagation();
              handleMessage(item.id);
            }}
          >
            <MessageCircle size={16} color="white" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Saved Pets</Text>
          <Text style={styles.headerSubtitle}>Your favorite companions</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <User size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingState 
          variant="inline"
          message="Loading your saved pets..."
          size="large"
        />
      ) : savedPets.length === 0 ? (
        <NoSavedPetsEmptyState 
          onDiscoverPets={() => router.push('/(tabs)')}
        />
      ) : (
        <FlatList
          data={savedPets}
          renderItem={renderPetItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 90, // Add padding for tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    minWidth: SPACING.minTouchTarget,
    minHeight: SPACING.minTouchTarget,
    padding: SPACING.sm,
    backgroundColor: `${COLORS.secondary}15`,
    borderRadius: BORDER_RADIUS.lg,
    marginLeft: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    padding: 20,
  },
  petCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  petInfo: {
    padding: 16,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  personalityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  locationButtonText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
  },
});