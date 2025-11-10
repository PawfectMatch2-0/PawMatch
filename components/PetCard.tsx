import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Heart, Calendar, Info, MessageCircle, CheckCircle } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = screenHeight * 0.7;

export interface Pet {
  id: string;
  name: string;
  age: string;
  breed: string;
  location: string;
  image: string | string[]; // Support both single image and array of images
  personality: string[];
  description: string;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  adoption_status?: 'available' | 'pending' | 'adopted';
  contact_info?: {
    phone?: string;
    whatsapp?: string;
  };
  owner?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface PetCardProps {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onPress: () => void;
}

export default function PetCard({ pet, onSwipeLeft, onSwipeRight, onPress }: PetCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const pressed = useSharedValue(0);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const imageUri = Array.isArray(pet.image) ? pet.image[0] : pet.image;

  // Debug logging  
  console.log('🐾 [PetCard] === FULL PET DATA ===');
  console.log('🐾 [PetCard] Pet Name:', pet.name);
  console.log('🐾 [PetCard] Pet ID:', pet.id);
  console.log('🐾 [PetCard] Has owner property?', 'owner' in pet);
  console.log('🐾 [PetCard] Owner value:', pet.owner);
  console.log('🐾 [PetCard] Owner type:', typeof pet.owner);
  console.log('🐾 [PetCard] Owner is truthy?', !!pet.owner);
  
  if (pet.owner) {
    console.log('✅ [PetCard] OWNER DATA EXISTS:');
    console.log('   - Email:', pet.owner.email);
    console.log('   - Name:', pet.owner.full_name);
    console.log('   - Avatar:', pet.owner.avatar_url);
    console.log('   - ID:', pet.owner.id);
  } else {
    console.log('❌ [PetCard] NO OWNER DATA for', pet.name);
    console.log('❌ [PetCard] Full pet object keys:', Object.keys(pet));
  }

  // Start shimmer animation
  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(0.95);
      pressed.value = withSpring(1);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      pressed.value = withSpring(0);
      
      if (Math.abs(event.translationX) > 100) {
        translateX.value = withSpring(event.translationX > 0 ? 1000 : -1000);
        
        // Call the appropriate callback after animation
        runOnJS(() => {
          if (event.translationX > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        })();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, 100, 200],
      [1, 0.8, 0.6]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotation}deg` },
        { scale: scale.value },
      ],
      opacity,
    };
  });

  const likeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, 100],
      [0, 1]
    );

    return {
      opacity,
      transform: [{ scale: opacity }],
    };
  });

  const passIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-100, 0],
      [1, 0]
    );

    return {
      opacity,
      transform: [{ scale: opacity }],
    };
  });

  const shimmerBorderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-100, CARD_WIDTH + 100]) }],
    };
  });

  const pressedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      pressed.value,
      [0, 1],
      [0, 0.1]
    );

    return {
      opacity,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {/* Shimmer Border Effect */}
        <View style={styles.shimmerContainer}>
          <Animated.View style={[styles.shimmerBorderContainer, shimmerBorderStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerBorder}
            />
          </Animated.View>
        </View>
        
        <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.9}>
          {/* Image with loading state and error handling */}
          <View style={styles.imageContainer}>
            {!imageLoaded && !imageError && (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Loading...</Text>
              </View>
            )}
            
            {imageError && (
              <View style={[styles.imagePlaceholder, styles.errorPlaceholder]}>
                <Text style={styles.errorText}>Image not available</Text>
                <Text style={styles.errorSubtext}>for {pet.name}</Text>
              </View>
            )}
            
            <Image 
              source={{ uri: imageUri }} 
              style={[
                styles.image,
                { opacity: imageLoaded && !imageError ? 1 : 0 }
              ]}
              onLoad={() => {
                console.log('Image loaded successfully for pet:', pet.name);
                setImageLoaded(true);
                setImageError(false);
              }}
              onError={(error) => {
                console.log('Image failed to load for pet:', pet.name, error.nativeEvent.error);
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          </View>
          
          <Animated.View style={[styles.likeIndicator, likeIndicatorStyle]}>
            <Heart size={40} color="#4CAF50" fill="#4CAF50" />
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View style={[styles.passIndicator, passIndicatorStyle]}>
            <Text style={styles.passText}>PASS</Text>
          </Animated.View>
          
          {/* Owner Info Header - Top of Card */}
          {pet.owner && (
            <View style={styles.ownerHeader}>
              {pet.owner.avatar_url ? (
                <Image 
                  source={{ uri: pet.owner.avatar_url }} 
                  style={styles.ownerHeaderAvatar}
                />
              ) : (
                <View style={[styles.ownerHeaderAvatar, styles.ownerHeaderAvatarPlaceholder]}>
                  <Text style={styles.ownerHeaderAvatarText}>
                    {(pet.owner.full_name || pet.owner.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.ownerHeaderInfo}>
                <Text style={styles.ownerHeaderName}>
                  {pet.owner.full_name || pet.owner.email.split('@')[0]}
                </Text>
                <Text style={styles.ownerHeaderEmail}>{pet.owner.email}</Text>
              </View>
            </View>
          )}

          {/* Status Badge - Top Right */}
          {pet.adoption_status && (
            <View style={[
              styles.statusBadgeCard,
              pet.adoption_status === 'available' && styles.statusAvailableCard,
              pet.adoption_status === 'pending' && styles.statusPendingCard,
              pet.adoption_status === 'adopted' && styles.statusAdoptedCard,
            ]}>
              {pet.adoption_status === 'adopted' && <CheckCircle size={12} color="#4CAF50" />}
              <Text style={styles.statusTextCard}>
                {pet.adoption_status === 'available' ? 'Available' : 
                 pet.adoption_status === 'pending' ? 'Pending' : 
                 'Adopted'}
              </Text>
            </View>
          )}

          {/* WhatsApp Icon - Top Left (moved down to not overlap with owner) */}
          {(pet.contact_info?.phone || pet.contact_info?.whatsapp) && (
            <View style={styles.whatsappBadgeCard}>
              <MessageCircle size={20} color="white" fill="#25D366" />
            </View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <View style={styles.petInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petAge}>{pet.age}</Text>
              </View>
              
              <Text style={styles.petBreed}>{pet.breed}</Text>
              
              <View style={styles.locationRow}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.location}>{pet.location}</Text>
              </View>
              
              <View style={styles.personalityTags}>
                {pet.personality.slice(0, 3).map((trait, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
          
          <TouchableOpacity style={styles.infoButton}>
            <Info size={20} color="white" />
          </TouchableOpacity>
          
          {/* Pressed overlay effect */}
          <Animated.View style={[styles.pressedOverlay, pressedStyle]} />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  },
  shimmerBorder: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 100,
    borderRadius: 20,
  },
  shimmerBorderContainer: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 100,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
    padding: 20,
  },
  petInfo: {
    marginBottom: 20,
  },
  ownerHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  ownerHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  ownerHeaderAvatarPlaceholder: {
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerHeaderAvatarText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  ownerHeaderInfo: {
    flex: 1,
  },
  ownerHeaderName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  ownerHeaderEmail: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  petName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginRight: 10,
  },
  petAge: {
    fontSize: 24,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  petBreed: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  personalityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  likeIndicator: {
    position: 'absolute',
    top: 50,
    right: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    transform: [{ rotate: '15deg' }],
  },
  likeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  passIndicator: {
    position: 'absolute',
    top: 50,
    left: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    transform: [{ rotate: '-15deg' }],
  },
  passText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
  },
  infoButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
  },
  pressedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  errorPlaceholder: {
    backgroundColor: '#ffebee',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#d32f2f',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 4,
  },
  statusBadgeCard: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    zIndex: 10,
  },
  statusAvailableCard: {
    backgroundColor: 'rgba(47, 165, 199, 0.95)',
  },
  statusPendingCard: {
    backgroundColor: 'rgba(255, 167, 38, 0.95)',
  },
  statusAdoptedCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
  },
  statusTextCard: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: 'white',
  },
  whatsappBadgeCard: {
    position: 'absolute',
    top: 80,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});