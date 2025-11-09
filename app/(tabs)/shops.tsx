import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Linking, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { MapPin, Star, Phone, User, Stethoscope, Scissors, GraduationCap, Store, Hotel, X, MessageCircle, Globe, Clock, Navigation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import * as petServicesService from '@/lib/services/petServicesService';
import { getPetServiceImage } from '@/lib/utils/petServiceImages';
import type { PetService } from '@/lib/services/petServicesService';

// Shop categories
const shopCategories = [
  { id: 'all', name: 'All', icon: Store, color: COLORS.primary },
  { id: 'pet-store', name: 'Pet Store', icon: Store, color: COLORS.categories.petStore },
  { id: 'veterinary', name: 'Veterinary', icon: Stethoscope, color: COLORS.categories.veterinary },
  { id: 'grooming', name: 'Grooming', icon: Scissors, color: COLORS.categories.grooming },
  { id: 'training', name: 'Training', icon: GraduationCap, color: COLORS.categories.training },
  { id: 'boarding', name: 'Boarding', icon: Hotel, color: COLORS.categories.boarding },
];

// Transform database service to UI format
const transformServiceData = (service: PetService) => {
  const getHoursText = () => {
    if (service.emergency_available) {
      return 'Open • 24 Hours Emergency';
    }
    return `${service.weekday_hours}`;
  };

  // Get category-specific images (with priority: Featured > Facebook > Unsplash)
  const getCategoryImage = () => {
    return getPetServiceImage(
      service.name,
      service.category,
      service.featured_image,
      service.contact_facebook
    );
  };

  const phones = Array.isArray(service.contact_phone) ? service.contact_phone : [service.contact_phone];
  const services = Array.isArray(service.services) ? service.services : [];
  const specialties = Array.isArray(service.specialties) ? service.specialties : [];

  return {
    id: service.id,
    name: service.name,
    category: service.category,
    rating: service.rating,
    reviews: service.reviews,
    address: `${service.location_area}, ${service.location_district}`,
    fullAddress: service.location_address,
    landmarks: service.location_landmarks,
    phone: phones[0] || '',
    allPhones: phones,
    email: service.contact_email,
    facebook: service.contact_facebook,
    website: service.contact_website,
    whatsapp: service.contact_whatsapp,
    image: getCategoryImage(),
    description: service.description,
    openHours: getHoursText(),
    weekdays: service.weekday_hours,
    weekends: service.weekend_hours,
    emergency: service.emergency_available,
    services: services.slice(0, 4),
    allServices: services,
    specialties: specialties,
    priceRange: service.price_range,
    established: service.established_year
  };
};

// Helper functions
const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case 'veterinary': return 'Veterinary';
    case 'grooming': return 'Grooming';
    case 'training': return 'Training';
    case 'pet-store': return 'Pet Store';
    case 'boarding': return 'Boarding';
    default: return 'Service';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'veterinary': return COLORS.categories.veterinary;
    case 'grooming': return COLORS.categories.grooming;
    case 'training': return COLORS.categories.training;
    case 'pet-store': return COLORS.categories.petStore;
    case 'boarding': return COLORS.categories.boarding;
    default: return COLORS.primary;
  }
};



export default function ShopsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filteredShops, setFilteredShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadPetServices();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 [Shops] Screen focused, refreshing pet services...');
      loadPetServices();
    }, [])
  );

  const loadPetServices = async () => {
    try {
      console.log('🏪 [Shops] Loading pet services from database...');
      const { data, error } = await petServicesService.getAllPetServices();
      
      if (data && data.length > 0) {
        console.log(`✅ [Shops] Loaded ${data.length} pet services`);
        const transformed = data.map(transformServiceData);
        setFilteredShops(transformed);
        setImageErrors({});
      } else {
        console.log('⚠️ [Shops] No pet services found in database');
        setFilteredShops([]);
      }
    } catch (err) {
      console.error('❌ [Shops] Error loading services:', err);
      setFilteredShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPetServices();
    setRefreshing(false);
  }, []);

  const filterShopsByCategory = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    try {
      if (categoryId === 'all') {
        const { data } = await petServicesService.getAllPetServices();
        if (data) {
          const transformed = data.map(transformServiceData);
          setFilteredShops(transformed);
        }
      } else {
        const { data } = await petServicesService.getPetServicesByCategory(categoryId);
        if (data) {
          const transformed = data.map(transformServiceData);
          setFilteredShops(transformed);
        }
      }
    } catch (err) {
      console.error('❌ [Shops] Error filtering services:', err);
    }
  };

  const handleShopPress = (shop: any) => {
    setSelectedShop(shop);
    setShowContactModal(true);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    Linking.openURL(`whatsapp://send?phone=${phone.replace(/\D/g, '')}`);
  };

  const handleFacebook = (facebookUrl: string) => {
    if (facebookUrl.startsWith('http')) {
      Linking.openURL(facebookUrl);
    } else {
      Linking.openURL(`https://${facebookUrl}`);
    }
  };

  const handleWebsite = (websiteUrl: string) => {
    if (websiteUrl.startsWith('http')) {
      Linking.openURL(websiteUrl);
    } else {
      Linking.openURL(`https://${websiteUrl}`);
    }
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const getImageSource = (item: any) => {
    const hasError = imageErrors[item.id];
    if (hasError) {
      return {
        uri: `https://source.unsplash.com/400x300?${encodeURIComponent(item.name)},${encodeURIComponent(item.category)},pet,bangladesh`
      };
    }
    return { uri: item.image };
  };

  const handleImageError = (shopId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [shopId]: true
    }));
  };

  const renderShopItem = ({ item }: { item: ReturnType<typeof transformServiceData> }) => (
    <TouchableOpacity style={styles.shopCard} onPress={() => handleShopPress(item)}>
      <Image 
        source={getImageSource(item)} 
        style={styles.shopImage}
        onError={() => handleImageError(item.id)}
      />
      
      <View style={styles.shopInfo}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{getCategoryDisplayName(item.category)}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFB800" fill="#FFB800" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={12} color="#666" />
          <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        </View>
        
        <Text style={styles.hours} numberOfLines={1}>{item.openHours}</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCall(item.phone)}
          >
            <Phone size={14} color="white" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );



  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'veterinary': return 'Veterinary';
      case 'grooming': return 'Grooming';
      case 'training': return 'Training';
      case 'pet-store': return 'Pet Store';
      case 'boarding': return 'Boarding';
      default: return 'Service';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Pet Services</Text>
          <Text style={styles.headerSubtitle}>Find trusted pet shops & vets</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <User size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading pet services...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
        
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {shopCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem, 
                  selectedCategory === category.id && styles.categoryItemActive
                ]}
                onPress={() => filterShopsByCategory(category.id)}
              >
                <View style={[
                  styles.categoryIcon, 
                  { backgroundColor: selectedCategory === category.id ? category.color : `${category.color}20` }
                ]}>
                  <category.icon 
                    size={20} 
                    color={selectedCategory === category.id ? 'white' : category.color} 
                  />
                </View>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Shop List */}
        <View style={styles.shopsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Shops' : `${selectedCategory} (${filteredShops.length})`}
          </Text>
          
          <FlatList
            data={filteredShops}
            renderItem={renderShopItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      )}

      {/* Contact Info Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContactModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedShop && (
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderContent}>
                  <Text style={styles.modalTitle}>{selectedShop.name}</Text>
                  <Text style={styles.modalCategory}>
                    {getCategoryDisplayName(selectedShop.category)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowContactModal(false)}
                >
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Shop Image */}
                <Image 
                  source={getImageSource(selectedShop)} 
                  style={styles.modalImage}
                  onError={() => handleImageError(selectedShop.id)}
                />

                {/* Shop Info */}
                <View style={styles.modalInfo}>
                  <View style={styles.modalRatingContainer}>
                    <Star size={16} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.modalRating}>{selectedShop.rating}</Text>
                    <Text style={styles.modalReviews}>({selectedShop.reviews} reviews)</Text>
                    <View style={[styles.priceRangeBadge, { backgroundColor: `${getCategoryColor(selectedShop.category)}20` }]}>
                      <Text style={[styles.priceRangeText, { color: getCategoryColor(selectedShop.category) }]}>
                        {selectedShop.priceRange.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.description}>{selectedShop.description}</Text>

                  {/* Contact Actions */}
                  <View style={styles.contactActions}>
                    {selectedShop.allPhones?.map((phone: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.contactButton, { backgroundColor: getCategoryColor(selectedShop.category) }]}
                        onPress={() => handleCall(phone)}
                      >
                        <Phone size={18} color="white" />
                        <Text style={styles.contactButtonText}>{phone}</Text>
                      </TouchableOpacity>
                    ))}

                    {selectedShop.whatsapp && (
                      <TouchableOpacity
                        style={[styles.contactButton, { backgroundColor: '#25D366' }]}
                        onPress={() => handleWhatsApp(selectedShop.whatsapp)}
                      >
                        <MessageCircle size={18} color="white" />
                        <Text style={styles.contactButtonText}>WhatsApp</Text>
                      </TouchableOpacity>
                    )}

                    {selectedShop.facebook && (
                      <TouchableOpacity
                        style={[styles.contactButton, { backgroundColor: '#1877F2' }]}
                        onPress={() => handleFacebook(selectedShop.facebook)}
                      >
                        <Text style={[styles.contactButtonText, { fontSize: 16, fontWeight: 'bold' }]}>f</Text>
                        <Text style={styles.contactButtonText}>Facebook</Text>
                      </TouchableOpacity>
                    )}

                    {selectedShop.website && (
                      <TouchableOpacity
                        style={[styles.contactButton, { backgroundColor: '#6B7280' }]}
                        onPress={() => handleWebsite(selectedShop.website)}
                      >
                        <Globe size={18} color="white" />
                        <Text style={styles.contactButtonText}>Website</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.contactButton, { backgroundColor: '#EF4444' }]}
                      onPress={() => handleDirections(selectedShop.fullAddress)}
                    >
                      <Navigation size={18} color="white" />
                      <Text style={styles.contactButtonText}>Directions</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Location Info */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Location</Text>
                    <View style={styles.modalLocationContainer}>
                      <MapPin size={16} color="#666" />
                      <View style={styles.modalLocationText}>
                        <Text style={styles.modalAddress}>{selectedShop.fullAddress}</Text>
                        {selectedShop.landmarks && (
                          <Text style={styles.landmarks}>{selectedShop.landmarks}</Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Hours */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Hours</Text>
                    <View style={styles.hoursContainer}>
                      <Clock size={16} color="#666" />
                      <View style={styles.hoursText}>
                        <Text style={styles.weekdays}>Weekdays: {selectedShop.weekdays}</Text>
                        <Text style={styles.weekends}>Weekends: {selectedShop.weekends}</Text>
                        {selectedShop.emergency && (
                          <Text style={styles.emergency}>24/7 Emergency Available</Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Services */}
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>All Services</Text>
                    <View style={styles.servicesGrid}>
                      {selectedShop.allServices?.map((service: string, index: number) => (
                        <View key={index} style={styles.serviceTag}>
                          <Text style={styles.serviceText}>{service}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Specialties */}
                  {selectedShop.specialties && selectedShop.specialties.length > 0 && (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoTitle}>Specialties</Text>
                      <View style={styles.specialtiesGrid}>
                        {selectedShop.specialties.map((specialty: string, index: number) => (
                          <View key={index} style={[styles.modalSpecialtyTag, { backgroundColor: `${getCategoryColor(selectedShop.category)}15` }]}>
                            <Text style={[styles.modalSpecialtyText, { color: getCategoryColor(selectedShop.category) }]}>{specialty}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Established */}
                  <View style={styles.establishedContainer}>
                    <Text style={styles.establishedText}>Established {selectedShop.established}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  subtitle: {
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
  content: {
    flex: 1,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 8,
  },
  categoryItemActive: {
    // Active state handled by conditional styling
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#333',
  },
  shopsSection: {
    flex: 1,
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    width: '47%',
  },
  shopImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  shopInfo: {
    padding: 12,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#FF6F61',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 9,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  hours: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#10B981',
    marginBottom: 10,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  moreSpecialties: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
    marginLeft: 4,
  },
  visitButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  modalCategory: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: 20,
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalRating: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#333',
    marginLeft: 6,
  },
  modalReviews: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  priceRangeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  priceRangeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  contactActions: {
    gap: 12,
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  modalLocationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalLocationText: {
    marginLeft: 12,
    flex: 1,
  },
  modalAddress: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    marginBottom: 4,
  },
  landmarks: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hoursText: {
    marginLeft: 12,
    flex: 1,
  },
  weekdays: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    marginBottom: 4,
  },
  weekends: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    marginBottom: 4,
  },
  emergency: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#10B981',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSpecialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalSpecialtyText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  establishedContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  establishedText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
});
