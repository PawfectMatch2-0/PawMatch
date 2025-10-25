import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Star, Phone, Clock, Globe, MessageCircle, Navigation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';
import { 
  dhakaVeterinaryServices, 
  dhakaGroomingServices, 
  dhakaTrainingServices, 
  dhakaPetStores, 
  dhakaBoardingServices,
  PetServiceProvider 
} from '../../data/bangladeshContent';

export default function ShopDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Find the service by ID
  const allServices = [
    ...dhakaVeterinaryServices,
    ...dhakaGroomingServices,
    ...dhakaTrainingServices,
    ...dhakaPetStores,
    ...dhakaBoardingServices
  ];
  
  const service = allServices.find(s => s.id === id);
  
  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Service not found</Text>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWebsite = (url: string) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const handleWhatsApp = (phone: string) => {
    Linking.openURL(`whatsapp://send?phone=${phone.replace(/\D/g, '')}`);
  };

  const handleDirections = () => {
    const address = encodeURIComponent(`${service.location.address}, ${service.location.district}`);
    Linking.openURL(`https://maps.google.com/?q=${address}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'veterinary':
        return COLORS.categories.veterinary;
      case 'grooming':
        return COLORS.categories.grooming;
      case 'training':
        return COLORS.categories.training;
      case 'boarding':
        return COLORS.categories.boarding;
      case 'pet-store':
        return COLORS.categories.petStore;
      default:
        return COLORS.primary;
    }
  };

  const categoryColor = getCategoryColor(service.category);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.featuredImage }} style={styles.headerImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {getCategoryDisplayName(service.category)}
                </Text>
              </View>
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={20} color="#FFB800" fill="#FFB800" />
              <Text style={styles.rating}>{service.rating}</Text>
              <Text style={styles.reviews}>({service.reviews} reviews)</Text>
            </View>
            
            <Text style={styles.description}>{service.description}</Text>
          </View>

          {/* Contact Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: categoryColor }]}
              onPress={() => handleCall(service.contact.phone[0])}
            >
              <Phone size={20} color="white" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            {service.contact.whatsapp && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#25D366' }]}
                onPress={() => handleWhatsApp(service.contact.whatsapp!)}
              >
                <MessageCircle size={20} color="white" />
                <Text style={styles.actionButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#4285F4' }]}
              onPress={handleDirections}
            >
              <Navigation size={20} color="white" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Location Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <MapPin size={20} color="#666" />
              <View style={styles.locationText}>
                <Text style={styles.address}>{service.location.address}</Text>
                <Text style={styles.landmarks}>{service.location.landmarks}</Text>
              </View>
            </View>
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours</Text>
            <View style={styles.hoursContainer}>
              <Clock size={20} color="#666" />
              <View style={styles.hoursText}>
                <Text style={styles.weekdays}>Weekdays: {service.timings.weekdays}</Text>
                <Text style={styles.weekends}>Weekends: {service.timings.weekends}</Text>
                {service.timings.emergency && (
                  <Text style={styles.emergency}>24/7 Emergency Available</Text>
                )}
              </View>
            </View>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.servicesGrid}>
              {service.services.map((serviceItem: string, index: number) => (
                <View key={index} style={styles.serviceTag}>
                  <Text style={styles.serviceText}>{serviceItem}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.specialtiesGrid}>
              {service.specialties.map((specialty: string, index: number) => (
                <View key={index} style={[styles.specialtyTag, { backgroundColor: `${categoryColor}15` }]}>
                  <Text style={[styles.specialtyText, { color: categoryColor }]}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactDetails}>
              {service.contact.phone.map((phone: string, index: number) => (
                <TouchableOpacity key={index} style={styles.contactItem} onPress={() => handleCall(phone)}>
                  <Phone size={16} color="#666" />
                  <Text style={styles.contactText}>{phone}</Text>
                </TouchableOpacity>
              ))}
              
              {service.contact.email && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactText}>{service.contact.email}</Text>
                </View>
              )}
              
              {service.contact.website && (
                <TouchableOpacity 
                  style={styles.contactItem} 
                  onPress={() => handleWebsite(service.contact.website!)}
                >
                  <Globe size={16} color="#666" />
                  <Text style={styles.contactText}>{service.contact.website}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#333',
    marginLeft: 6,
  },
  reviews: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  address: {
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
  specialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  contactDetails: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    marginLeft: 8,
  },
});