import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Filter, Bell, Heart, X, MapPin, Star, User } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import LoadingState from '@/components/ui/LoadingState';
import { NoPetsEmptyState } from '@/components/ui/EmptyState';
import OnboardingModal from '@/components/ui/OnboardingModal';
import ImprovedSwiper from '@/components/ui/ImprovedSwiper';
import { AdoptionFlowStatus } from '@/types/adoption';
import { LinearGradient } from 'expo-linear-gradient';
import { mockPets } from '@/data/pets';
import FilterModal, { Filters } from '@/components/FilterModal';
import { supabase, databaseService, authService, Pet } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 30;
const CARD_HEIGHT = height * 0.7;

export default function HomeScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedPets, setLikedPets] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    breed: 'All Breeds',
    age: 'All Ages',
    size: 'All Sizes',
    distance: 'Any Distance'
  });
  
  // Database integration
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Simple current pet tracking
  const totalPets = filteredPets?.length || 0;
  const currentPet = totalPets > 0 && currentIndex < totalPets ? filteredPets[currentIndex] : null;

  // Initialize data loading
  useEffect(() => {
    initializeData();
    checkOnboardingStatus();
  }, []);

  // Check if user needs onboarding
  const checkOnboardingStatus = async () => {
    try {
      // Check if onboarding has been completed (could use AsyncStorage in real app)
      // For now, show onboarding for new/guest users
      if (!user) {
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000); // Show after initial loading
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    }
  };

  // Load user and pets data
  const initializeData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Load pets from database
      if (supabase) {
        const petsData = currentUser 
          ? await databaseService.getPetsExcludingInteracted(currentUser.id)
          : await databaseService.getAvailablePets();
        
        if (petsData.length > 0) {
          setPets(petsData);
          setFilteredPets(petsData);
        } else {
          // Fallback to mock data if no database pets
          const mockPetsConverted = convertMockPetsToDBFormat(mockPets);
          setPets(mockPetsConverted);
          setFilteredPets(mockPetsConverted);
        }
      } else {
        // Use mock data if Supabase not configured
        const mockPetsConverted = convertMockPetsToDBFormat(mockPets);
        setPets(mockPetsConverted);
        setFilteredPets(mockPetsConverted);
      }
    } catch (error) {
      console.error('Error loading pets:', error);
      // Fallback to mock data on error
      const mockPetsConverted = convertMockPetsToDBFormat(mockPets);
      setPets(mockPetsConverted);
      setFilteredPets(mockPetsConverted);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert mock pets to database format for consistency
  const convertMockPetsToDBFormat = (mockData: typeof mockPets): Pet[] => {
    return mockData.map(pet => ({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      personality: pet.personality,
      description: pet.description,
      images: [pet.image],
      location: pet.location,
      shelter_id: 'mock-shelter',
      status: 'available' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  };

  // Apply filters effect
  useEffect(() => {
    applyFilters(filters);
  }, [filters, pets]);

  const applyFilters = (newFilters: Filters) => {
    let filtered = [...pets];
    
    // Apply breed filter
    if (newFilters.breed !== 'All Breeds') {
      filtered = filtered.filter(pet => 
        pet.breed.toLowerCase().includes(newFilters.breed.toLowerCase())
      );
    }
    
    // Apply age filter
    if (newFilters.age !== 'All Ages') {
      filtered = filtered.filter(pet => {
        const petAge = pet.age;
        const filterAge = newFilters.age.toLowerCase();
        
        if (filterAge.includes('puppy') || filterAge.includes('kitten')) {
          return petAge < 1;
        }
        if (filterAge.includes('young')) {
          return petAge >= 1 && petAge <= 3;
        }
        if (filterAge.includes('adult')) {
          return petAge >= 4 && petAge <= 7;
        }
        if (filterAge.includes('senior')) {
          return petAge >= 8;
        }
        return true;
      });
    }
    
    // Apply size filter
    if (newFilters.size !== 'All Sizes') {
      filtered = filtered.filter(pet => 
        pet.size.toLowerCase() === newFilters.size.toLowerCase()
      );
    }
    
    setFilteredPets(filtered);
    
    // Reset to first pet when filters change
    setCurrentIndex(0);
  };

  const handleLike = async (pet: Pet, index: number) => {
    console.log('🤍 User liked pet:', pet.name);
    
    // Add to liked pets locally
    setLikedPets(prev => [...prev, pet.id]);
    
    // Record interaction in database if user is logged in
    if (user && supabase) {
      try {
        await databaseService.recordPetInteraction(user.id, pet.id, 'like');
        await databaseService.addToFavorites(user.id, pet.id);
        
        // TODO: Check if shelter also likes (mutual match)
        // This would trigger AdoptionFlowStatus.MATCHED
        console.log('✅ Pet saved! Status:', AdoptionFlowStatus.LIKED);
      } catch (error) {
        console.error('Error recording like:', error);
      }
    }
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };
  
  const handlePass = async (pet: Pet, index: number) => {
    console.log('👎 User passed on pet:', pet.name);
    
    // Record interaction in database if user is logged in
    if (user && supabase) {
      try {
        await databaseService.recordPetInteraction(user.id, pet.id, 'pass');
      } catch (error) {
        console.error('Error recording pass:', error);
      }
    }
    
    // Move to next card
    setCurrentIndex(prev => prev + 1);
  };

  const handleCardPress = (pet: Pet, index: number) => {
    // Navigate to pet details page with liked status
    router.push({
      pathname: '/pet-details/[id]',
      params: { 
        id: pet.id,
        isLiked: likedPets.includes(pet.id).toString()
      }
    });
  };

  const renderCard = (pet: Pet | null, isNext = false) => {
    if (!pet) return null;
    
    // Handle the images array from database Pet format
    const imageUri = pet.images && pet.images.length > 0 
      ? pet.images[0] 
      : 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400'; // Default fallback image
    
    return (
      <TouchableOpacity 
        style={[styles.petCard, isNext && styles.nextCard]}
        onPress={isNext ? undefined : () => handleCardPress(pet, currentIndex)}
        activeOpacity={isNext ? 1 : 0.95}
      >
        <Image 
          source={{ uri: imageUri }} 
          style={styles.petImage}
          onError={(error) => {
            // Silently handle image loading errors
          }}
        />
        
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />
        
        {/* Pet info overlay */}
        <View style={styles.petInfoOverlay}>
          <View style={styles.petHeader}>
            <Text style={styles.petName}>{pet.name}</Text>
            <View style={styles.ageContainer}>
              <Text style={styles.petAge}>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</Text>
            </View>
          </View>
          
          <Text style={styles.petBreed}>{pet.breed}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.petLocation}>{pet.location}</Text>
          </View>
          
          <View style={styles.personalityContainer}>
            {pet.personality.slice(0, 3).map((trait: string, index: number) => (
              <View key={index} style={styles.personalityTag}>
                <Text style={styles.personalityText}>{trait}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.petDescription} numberOfLines={2}>
            {pet.description}
          </Text>
        </View>
        
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={styles.ratingText}>4.9</Text>
        </View>
        
        {/* Tap indicator for current card - aligned with rating */}
        {!isNext && (
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>Tap for details</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowFilterModal(true)}>
            <Filter size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/notifications')}>
            <Bell size={24} color="#FF6B6B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/profile')}>
            <User size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <LoadingState 
          variant="inline" 
          message="Finding perfect pets for you..."
          size="large"
        />
      ) : totalPets === 0 ? (
        <NoPetsEmptyState 
          onAdjustFilters={() => setShowFilterModal(true)}
        />
      ) : (
        <ImprovedSwiper
          data={filteredPets}
          currentIndex={currentIndex}
          renderCard={(pet: Pet, index: number) => renderCard(pet, false)}
          onSwipeLeft={handlePass}
          onSwipeRight={handleLike}
          onCardPress={handleCardPress}
        />
      )}

      {currentPet && totalPets > 0 && currentIndex < totalPets && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.passButton} 
            onPress={() => handlePass(currentPet, currentIndex)}
          >
            <X size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={() => handleLike(currentPet, currentIndex)}
          >
            <Heart size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 85, // Account for absolute positioned tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    minWidth: SPACING.minTouchTarget,
    minHeight: SPACING.minTouchTarget,
    padding: SPACING.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  petCard: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'white',
    ...SHADOWS.lg,
  },
  nextCard: {
    opacity: 0.7,
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  petInfoOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  petName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    flex: 1,
  },
  ageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  petAge: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  petBreed: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petLocation: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  personalityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  personalityTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 6,
  },
  personalityText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  petDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  ratingBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginLeft: 4,
  },
  tapIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tapText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    paddingTop: 5,
    gap: 80,
  },
  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: SPACING.minTouchTarget,
    minHeight: SPACING.minTouchTarget,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  likeButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: SPACING.minTouchTarget,
    minHeight: SPACING.minTouchTarget,
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

