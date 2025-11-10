import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Linking, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Ruler, 
  Info,
  Phone,
  MessageCircle,
  Star,
  User,
  CheckCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mockPets } from '@/data/pets';
import AnimatedButton from '@/components/AnimatedButton';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function PetDetailScreen() {
  const { id, owner } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pet, setPet] = useState<any>(null);
  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if this is the user's own pet
  const isOwnerView = owner === 'true';

  useEffect(() => {
    loadPetData();
  }, [id]);

  const loadPetData = async () => {
    if (!supabase || !id) {
      // Fallback to mock data
      const mockPet = mockPets.find(p => p.id === id);
      setPet(mockPet);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPet(data);

      // Load owner profile if owner_id exists
      if (data.owner_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('full_name, email, phone, avatar_url')
          .eq('id', data.owner_id)
          .single();

        if (!profileError && profileData) {
          setOwnerProfile(profileData);
        }
      }
    } catch (error) {
      console.error('Error loading pet:', error);
      // Fallback to mock data
      const mockPet = mockPets.find(p => p.id === id);
      setPet(mockPet);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    // Try pet's contact info first, then owner's phone as fallback
    const phoneNumber = pet?.contact_info?.phone || pet?.contact_info?.whatsapp || ownerProfile?.phone;
    
    if (!phoneNumber) {
      Alert.alert('No Contact', 'WhatsApp contact information is not available for this pet.');
      return;
    }

    // Remove all non-numeric characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`Hi! I'm interested in adopting ${pet?.name || 'your pet'}.`);
    const whatsappUrl = `whatsapp://send?phone=${cleanNumber}&text=${message}`;

    Linking.canOpenURL(whatsappUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert('WhatsApp Not Found', 'Please install WhatsApp to contact the pet owner');
        }
      })
      .catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Could not open WhatsApp');
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading pet details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Pet not found</Text>
          <AnimatedButton
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            size="medium"
          />
        </View>
      </SafeAreaView>
    );
  }

  // Get gallery images from pet data
  const galleryImages = pet.images && Array.isArray(pet.images) && pet.images.length > 0
    ? pet.images
    : pet.image
    ? (Array.isArray(pet.image) ? pet.image : [pet.image])
    : ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'];

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Add to favorites logic
  };

  const handleShare = () => {
    console.log('Share pet:', pet.name);
    // TODO: Share functionality
  };

  const handleContact = () => {
    console.log('Contact about:', pet.name);
    // TODO: Contact shelter/owner
  };

  const handleAdopt = () => {
    console.log('Adopt:', pet.name);
    // TODO: Adoption process
  };

  const renderPersonalityTags = () => (
    <View style={styles.personalityContainer}>
      <Text style={styles.sectionTitle}>Personality</Text>
      <View style={styles.personalityTags}>
        {pet.personality && pet.personality.map((trait: string, index: number) => (
          <View key={index} style={styles.personalityTag}>
            <Text style={styles.personalityText}>{trait}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInfoCard = (icon: any, title: string, value: string) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        {icon}
      </View>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(slideIndex);
        }}
        scrollEventThrottle={16}
      >
        {galleryImages.map((imageUri: string, index: number) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.galleryImage} />
        ))}
      </ScrollView>
      
      {/* Image Indicators */}
      <View style={styles.imageIndicators}>
        {galleryImages.map((_: string, index: number) => (
          <View 
            key={index} 
            style={[
              styles.indicator, 
              currentImageIndex === index && styles.activeIndicator
            ]} 
          />
        ))}
      </View>

      {/* Header Controls */}
      <View style={styles.headerControls}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <ArrowLeft size={24} color="white" strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={22} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, isFavorited && styles.favoriteActive]} 
            onPress={handleFavorite}
          >
            <Heart 
              size={22} 
              color={isFavorited ? "#FF6B6B" : "white"} 
              fill={isFavorited ? "#FF6B6B" : "transparent"}
              strokeWidth={2} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Pet Info Section */}
        <View style={styles.contentContainer}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <View style={styles.nameAndStatusRow}>
              <View style={styles.nameSection}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.breed}>{pet.breed}</Text>
              </View>
            </View>

            {/* Status and Location Row */}
            <View style={styles.statusLocationRow}>
              {/* Adoption Status Badge */}
              {pet.adoption_status && (
                <View style={[
                  styles.statusBadgeCompact,
                  pet.adoption_status === 'available' && styles.statusAvailable,
                  pet.adoption_status === 'pending' && styles.statusPending,
                  pet.adoption_status === 'adopted' && styles.statusAdopted,
                ]}>
                  {pet.adoption_status === 'adopted' && <CheckCircle size={12} color="#4CAF50" />}
                  <Text style={[
                    styles.statusTextCompact,
                    pet.adoption_status === 'available' && styles.statusTextAvailable,
                    pet.adoption_status === 'pending' && styles.statusTextPending,
                    pet.adoption_status === 'adopted' && styles.statusTextAdopted,
                  ]}>
                    {pet.adoption_status === 'available' ? 'Available' : 
                     pet.adoption_status === 'pending' ? 'Pending' : 
                     'Adopted'}
                  </Text>
                </View>
              )}
              
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#666" />
                <Text style={styles.location}>{pet.location}</Text>
              </View>
            </View>

            {/* Pet Uploaded By */}
            {ownerProfile && (
              <View style={styles.uploadedByContainer}>
                {ownerProfile.avatar_url ? (
                  <Image source={{ uri: ownerProfile.avatar_url }} style={styles.ownerAvatarSmall} />
                ) : (
                  <User size={18} color="#999" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.uploadedByText}>
                  Uploaded by <Text style={styles.ownerName}>{ownerProfile.full_name || 'Pet Owner'}</Text>
                </Text>
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            {renderInfoCard(
              <Calendar size={20} color="#FF6B6B" />,
              "Age",
              pet.age
            )}
            {renderInfoCard(
              <User size={20} color="#FF6B6B" />,
              "Gender",
              pet.gender
            )}
            {renderInfoCard(
              <Ruler size={20} color="#FF6B6B" />,
              "Size",
              pet.size
            )}
          </View>

          {/* Personality Tags */}
          {renderPersonalityTags()}

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.description}>{pet.description}</Text>
          </View>

          {/* Contact Information - Only show for non-owner pets */}
          {!isOwnerView && (
            <View style={styles.contactContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactInfo}>
                {/* Owner Info */}
                {ownerProfile && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIconCircle}>
                      {ownerProfile.avatar_url ? (
                        <Image source={{ uri: ownerProfile.avatar_url }} style={styles.ownerAvatarMedium} />
                      ) : (
                        <User size={20} color={COLORS.secondary} />
                      )}
                    </View>
                    <View style={styles.contactText}>
                      <Text style={styles.contactTitle}>Pet Owner</Text>
                      <Text style={styles.contactValue}>{ownerProfile.full_name || 'Pet Owner'}</Text>
                      {ownerProfile.email && (
                        <Text style={styles.contactEmail}>{ownerProfile.email}</Text>
                      )}
                    </View>
                  </View>
                )}

                {/* Location */}
                {pet.location && (
                  <View style={styles.contactItem}>
                    <View style={styles.contactIconCircle}>
                      <MapPin size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.contactText}>
                      <Text style={styles.contactTitle}>Location</Text>
                      <Text style={styles.contactValue}>{pet.location}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Action Buttons - Only show for non-owner pets */}
          {!isOwnerView && (pet.contact_info?.phone || pet.contact_info?.whatsapp || ownerProfile?.phone) && (
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.whatsappButtonCompact} onPress={handleWhatsAppContact}>
                <View style={styles.whatsappCircle}>
                  <MessageCircle size={24} color="white" />
                </View>
                <View style={styles.whatsappTextContainer}>
                  <Text style={styles.whatsappLabel}>Contact Owner</Text>
                  <Text style={styles.whatsappSubtext}>via WhatsApp</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Owner Actions - Only show for owner pets */}
          {isOwnerView && (
            <View style={styles.actionContainer}>
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/profile/pet/${pet.id}/edit` as any)}>
                  <MessageCircle size={20} color="#FF6B6B" />
                  <Text style={styles.secondaryButtonText}>Edit Info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => console.log('Share pet')}>
                  <Phone size={20} color="#FF6B6B" />
                  <Text style={styles.secondaryButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
              
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.adoptButton}
              >
                <TouchableOpacity style={styles.adoptButtonInner} onPress={() => console.log('View health records')}>
                  <Text style={styles.adoptButtonText}>Health Records</Text>
                  <Heart size={20} color="white" fill="white" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginBottom: 20,
  },
  imageGallery: {
    height: 400,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: 400,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  basicInfo: {
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameAndStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  petName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  breed: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.primary,
  },
  whatsappIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statusLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  statusTextCompact: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  uploadedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFB',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  uploadedByText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#999',
  },
  ownerName: {
    fontFamily: 'Nunito-Bold',
    color: COLORS.secondary,
  },
  ownerAvatarSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 6,
    backgroundColor: '#eee',
  },
  ownerAvatarMedium: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  personalityContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  personalityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personalityTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  personalityText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#FF6B6B',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 24,
  },
  contactContainer: {
    marginBottom: 32,
  },
  contactInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(47, 165, 199, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whatsappIconCircle: {
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
  },
  contactText: {
    flex: 1,
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    color: '#25D366',
    marginTop: 4,
  },
  contactValueUnavailable: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#999',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#25D366',
    marginTop: 2,
  },
  contactSubtitleGray: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    marginTop: 2,
  },
  actionContainer: {
    paddingBottom: 32,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FF6B6B',
  },
  adoptButton: {
    borderRadius: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  adoptButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  adoptButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito-Regular',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  statusAvailable: {
    backgroundColor: COLORS.secondary + '15',
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  statusPending: {
    backgroundColor: '#FFA726' + '15',
    borderWidth: 1,
    borderColor: '#FFA726' + '40',
  },
  statusAdopted: {
    backgroundColor: '#4CAF50' + '15',
    borderWidth: 1,
    borderColor: '#4CAF50' + '40',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
  },
  statusTextAvailable: {
    color: COLORS.secondary,
  },
  statusTextPending: {
    color: '#FFA726',
  },
  statusTextAdopted: {
    color: '#4CAF50',
  },
  whatsappButtonCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  whatsappCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappTextContainer: {
    flex: 1,
  },
  whatsappLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  whatsappSubtext: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#25D366',
  },
});
