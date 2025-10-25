import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Star, Phone, Clock, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';
import { useState } from 'react';
import { 
  dhakaVeterinaryServices, 
  dhakaGroomingServices, 
  dhakaTrainingServices, 
  dhakaPetStores, 
  dhakaBoardingServices,
  PetServiceProvider 
} from '../../data/bangladeshContent';

// Combine all Bangladesh pet services
const getAllPetServices = (): PetServiceProvider[] => {
  return [
    ...dhakaVeterinaryServices,
    ...dhakaGroomingServices,
    ...dhakaTrainingServices,
    ...dhakaPetStores,
    ...dhakaBoardingServices
  ];
};

// Transform service data to match the UI format
const transformServiceData = (service: PetServiceProvider) => {
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

  const getHoursText = () => {
    if (service.timings.emergency) {
      return 'Open • 24 Hours Emergency';
    }
    return `Open • ${service.timings.weekdays}`;
  };

  const getDistance = () => {
    // Generate realistic distances for Dhaka locations
    const distances = ['0.8 km', '1.2 km', '1.5 km', '2.1 km', '2.8 km', '3.2 km', '3.8 km', '4.5 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  return {
    id: service.id,
    name: service.name,
    category: getCategoryDisplayName(service.category),
    rating: service.rating,
    reviews: service.reviews,
    distance: getDistance(),
    image: service.featuredImage,
    address: `${service.location.area}, ${service.location.district}`,
    phone: service.contact.phone[0],
    hours: getHoursText(),
    specialties: service.specialties.slice(0, 3)
  };
};

export default function ShopsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all services and transform them for UI
  const allServices = getAllPetServices();
  const transformedServices = allServices.map(transformServiceData);
  
  // Filter services based on selected category
  const filteredServices = selectedCategory === 'all' 
    ? transformedServices 
    : transformedServices.filter(service => service.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = [
    { id: 'all', name: 'All', color: COLORS.primary },
    { id: 'veterinary', name: 'Veterinary', color: COLORS.categories.veterinary },
    { id: 'grooming', name: 'Grooming', color: COLORS.categories.grooming },
    { id: 'training', name: 'Training', color: COLORS.categories.training },
    { id: 'pet store', name: 'Pet Store', color: COLORS.categories.petStore },
    { id: 'boarding', name: 'Boarding', color: COLORS.categories.boarding },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleShopPress = (shopId: string) => {
    router.push(`/shops/${shopId}`);
  };

  const handleCall = (phone: string) => {
    console.log('Call:', phone);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'veterinary':
        return COLORS.categories.veterinary;
      case 'grooming':
        return COLORS.categories.grooming;
      case 'training':
        return COLORS.categories.training;
      case 'boarding':
        return COLORS.categories.boarding;
      case 'pet store':
        return COLORS.categories.petStore;
      default:
        return COLORS.primary;
    }
  };

  const renderShopItem = ({ item }: { item: ReturnType<typeof transformServiceData> }) => {
    const categoryColor = getCategoryColor(item.category);
    
    return (
      <TouchableOpacity style={styles.shopCard} onPress={() => handleShopPress(item.id)}>
        <LinearGradient
          colors={[`${categoryColor}15`, `${categoryColor}25`]}
          style={styles.cardGradient}
        />
        <Image source={{ uri: item.image }} style={styles.shopImage} />
        <View style={styles.shopInfo}>
          <View style={styles.shopHeader}>
            <Text style={styles.shopName}>{item.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>{item.category}</Text>
            </View>
          </View>
    );
        
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFB800" fill="#FFB800" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews} reviews)</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#666" />
          <Text style={styles.address}>{item.address}</Text>
          <Text style={styles.distance}>• {item.distance}</Text>
        </View>
        
        <Text style={styles.hours}>{item.hours}</Text>
        
        <View style={styles.specialtiesContainer}>
          {item.specialties.slice(0, 2).map((specialty: string, index: number) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
          {item.specialties.length > 2 && (
            <Text style={styles.moreSpecialties}>+{item.specialties.length - 2} more</Text>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.callButton, { backgroundColor: categoryColor }]}
            onPress={() => handleCall(item.phone)}
          >
            <Phone size={16} color="white" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.visitButton, { borderColor: categoryColor }]}
            onPress={() => handleShopPress(item.id)}
          >
            <Text style={[styles.visitButtonText, { color: categoryColor }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.categories.emergency, COLORS.categories.boarding]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Shops & Services</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Discover nearby pet stores, clinics, and services</Text>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && { backgroundColor: category.color }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.categoryButtonTextActive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <FlatList
          data={filteredServices}
          renderItem={renderShopItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  shopImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  shopInfo: {
    padding: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 18,
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
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
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
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#10B981',
    marginBottom: 12,
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
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 14,
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
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
});