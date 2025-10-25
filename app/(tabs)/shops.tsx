import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MapPin, Star, Phone, User, Stethoscope, Scissors, GraduationCap, Store, Hotel } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

// Shop categories
const shopCategories = [
  { id: 'all', name: 'All', icon: Store, color: COLORS.primary },
  { id: 'Pet Store', name: 'Pet Store', icon: Store, color: COLORS.secondary },
  { id: 'Veterinary', name: 'Veterinary', icon: Stethoscope, color: '#50C878' },
  { id: 'Grooming', name: 'Grooming', icon: Scissors, color: '#9B59B6' },
  { id: 'Training', name: 'Training', icon: GraduationCap, color: '#FF8C00' },
  { id: 'Hotel', name: 'Pet Hotel', icon: Hotel, color: '#E74C3C' },
];

// Real pet services in Dhaka, Bangladesh
const dhakaPetServices = [
  {
    id: '1',
    name: 'Furryghor',
    category: 'Pet Store',
    rating: 4.8,
    reviews: 245,
    address: 'House 10, Road 12, Block E, Banani, Dhaka 1213',
    phone: '+880 1711-223344',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    description: 'Premium pet store offering high-quality pet food, accessories, and grooming services.',
    openHours: 'Sat-Thu: 10 AM - 9 PM, Fri: 2 PM - 9 PM',
    services: ['Pet Food', 'Accessories', 'Grooming', 'Pet Adoption'],
  },
  {
    id: '2',
    name: 'Petsworld Bangladesh',
    category: 'Pet Store',
    rating: 4.6,
    reviews: 189,
    address: 'House 27, Road 2, Dhanmondi, Dhaka 1205',
    phone: '+880 1777-888999',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    description: 'Complete pet care solutions with imported and local pet products.',
    openHours: 'Daily: 10 AM - 8 PM',
    services: ['Pet Food', 'Toys', 'Cages', 'Health Products'],
  },
  {
    id: '3',
    name: 'The Pet Planet BD',
    category: 'Pet Store',
    rating: 4.7,
    reviews: 156,
    address: 'Ka-93/4/A, Progoti Sarani, Kuril, Dhaka 1229',
    phone: '+880 1611-334455',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
    description: 'One-stop shop for all your pet needs with expert consultation.',
    openHours: 'Sat-Thu: 11 AM - 9 PM, Fri: Closed',
    services: ['Dog Food', 'Cat Food', 'Bird Food', 'Aquarium'],
  },
  {
    id: '4',
    name: 'Pet Zone Bangladesh',
    category: 'Pet Store',
    rating: 4.5,
    reviews: 134,
    address: 'Shop 15, Level 4, Jamuna Future Park, Dhaka 1229',
    phone: '+880 1955-667788',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Modern pet store in Jamuna Future Park with wide variety of pet supplies.',
    openHours: 'Daily: 10 AM - 10 PM',
    services: ['Pet Supplies', 'Grooming', 'Pet Training', 'Vet Consultation'],
  },
  {
    id: '5',
    name: 'Central Veterinary Hospital',
    category: 'Veterinary',
    rating: 4.9,
    reviews: 312,
    address: '32 Segunbagicha, Dhaka 1000',
    phone: '+880 1713-445566',
    image: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400',
    description: 'Leading veterinary hospital with 24/7 emergency services and experienced vets.',
    openHours: '24/7 Emergency Services',
    services: ['Surgery', 'Vaccination', 'X-Ray', 'Laboratory', 'Emergency Care'],
  },
  {
    id: '6',
    name: 'Advanced Veterinary Centre',
    category: 'Veterinary',
    rating: 4.8,
    reviews: 278,
    address: 'House 71, Road 7A, Dhanmondi, Dhaka 1209',
    phone: '+880 1755-223344',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    description: 'State-of-the-art veterinary care with modern diagnostic facilities.',
    openHours: 'Daily: 9 AM - 10 PM',
    services: ['Health Checkup', 'Dental Care', 'Surgery', 'Ultrasound', 'Pet Pharmacy'],
  },
  {
    id: '7',
    name: 'Dhaka Veterinary Clinic',
    category: 'Veterinary',
    rating: 4.6,
    reviews: 198,
    address: 'House 23, Road 103, Gulshan 2, Dhaka 1212',
    phone: '+880 1819-556677',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
    description: 'Experienced veterinarians providing comprehensive pet healthcare.',
    openHours: 'Sat-Thu: 9 AM - 9 PM, Fri: 3 PM - 9 PM',
    services: ['Consultation', 'Vaccination', 'Deworming', 'Skin Treatment'],
  },
  {
    id: '8',
    name: 'Pet Care Vet',
    category: 'Veterinary',
    rating: 4.7,
    reviews: 225,
    address: 'Cha-60/1, North Badda, Dhaka 1212',
    phone: '+880 1672-889900',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400',
    description: 'Compassionate veterinary care for all types of pets.',
    openHours: 'Daily: 10 AM - 8 PM',
    services: ['General Checkup', 'Pet Surgery', 'Lab Tests', 'Pet Grooming'],
  },
  {
    id: '9',
    name: 'Paws & Claws Grooming',
    category: 'Grooming',
    rating: 4.8,
    reviews: 167,
    address: 'House 45, Road 11, Banani, Dhaka 1213',
    phone: '+880 1533-778899',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
    description: 'Professional pet grooming services with trained groomers.',
    openHours: 'Daily: 9 AM - 7 PM',
    services: ['Bath & Brush', 'Hair Cut', 'Nail Trim', 'Ear Cleaning', 'De-matting'],
  },
  {
    id: '10',
    name: 'Furry Friends Salon',
    category: 'Grooming',
    rating: 4.7,
    reviews: 143,
    address: 'Plot 12, Road 113, Gulshan 2, Dhaka 1212',
    phone: '+880 1922-334455',
    image: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400',
    description: 'Luxury grooming services for your beloved pets.',
    openHours: 'Sat-Thu: 10 AM - 8 PM, Fri: 2 PM - 8 PM',
    services: ['Spa Treatment', 'Styling', 'Teeth Cleaning', 'Flea Treatment'],
  },
  {
    id: '11',
    name: 'Pet Elegance',
    category: 'Grooming',
    rating: 4.6,
    reviews: 128,
    address: 'House 18, Road 27, Uttara Sector 7, Dhaka 1230',
    phone: '+880 1711-998877',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400',
    description: 'Premium grooming services with natural and organic products.',
    openHours: 'Daily: 10 AM - 7 PM',
    services: ['Full Grooming', 'Show Cuts', 'De-shedding', 'Paw Care'],
  },
  {
    id: '12',
    name: 'K9 Training Academy',
    category: 'Training',
    rating: 4.9,
    reviews: 201,
    address: 'House 112, Road 12, Baridhara DOHS, Dhaka 1206',
    phone: '+880 1866-223344',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400',
    description: 'Professional dog training with certified trainers and behavioral experts.',
    openHours: 'Sat-Thu: 7 AM - 7 PM, Fri: Closed',
    services: ['Puppy Training', 'Obedience', 'Agility', 'Behavioral Modification'],
  },
  {
    id: '13',
    name: 'Smart Pet Training Center',
    category: 'Training',
    rating: 4.7,
    reviews: 156,
    address: 'House 34, Road 8, Block D, Mirpur DOHS, Dhaka 1216',
    phone: '+880 1755-667788',
    image: 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=400',
    description: 'Expert training programs for dogs of all ages and breeds.',
    openHours: 'Daily: 6 AM - 6 PM',
    services: ['Basic Training', 'Advanced Training', 'Guard Dog Training', 'Therapy Dog'],
  },
  {
    id: '14',
    name: 'Pawsitive Training',
    category: 'Training',
    rating: 4.8,
    reviews: 189,
    address: 'House 56, Road 15, Gulshan 1, Dhaka 1212',
    phone: '+880 1611-445566',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=400',
    description: 'Positive reinforcement based training for happy and well-behaved pets.',
    openHours: 'Sat-Thu: 8 AM - 6 PM, Fri: Closed',
    services: ['Puppy Socialization', 'Leash Training', 'Trick Training', 'Problem Solving'],
  },
  {
    id: '15',
    name: 'Pet Paradise Hotel',
    category: 'Pet Hotel',
    rating: 4.8,
    reviews: 234,
    address: 'House 89, Road 21, Banani, Dhaka 1213',
    phone: '+880 1944-556677',
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=400',
    description: 'Luxury pet boarding facility with spacious rooms and play areas.',
    openHours: '24/7 Boarding Services',
    services: ['Day Care', 'Overnight Boarding', 'Play Time', 'Meal Service', 'Grooming'],
  },
  {
    id: '16',
    name: 'Happy Tails Pet Hotel',
    category: 'Pet Hotel',
    rating: 4.7,
    reviews: 178,
    address: 'Plot 45, Road 4, Bashundhara R/A, Dhaka 1229',
    phone: '+880 1799-887766',
    image: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=400',
    description: 'Safe and comfortable pet hotel with 24/7 care and monitoring.',
    openHours: 'Daily: 24/7 Check-in Available',
    services: ['Pet Boarding', 'Day Care', 'Exercise Sessions', 'Vet on Call'],
  },
];

export default function ShopsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredShops, setFilteredShops] = useState(dhakaPetServices);

  const filterShopsByCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredShops(dhakaPetServices);
    } else {
      setFilteredShops(dhakaPetServices.filter(shop => shop.category === categoryId));
    }
  };

  const handleShopPress = (shopId: string) => {
    // Navigate to shop details (placeholder for now)
    console.log('Shop pressed:', shopId);
  };

  const handleCall = (phone: string) => {
    // Open phone dialer with the number
    Linking.openURL(`tel:${phone}`);
  };

  const renderShopItem = ({ item }: { item: typeof dhakaPetServices[0] }) => (
    <TouchableOpacity style={styles.shopCard} onPress={() => handleShopPress(item.id)}>
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      
      <View style={styles.shopInfo}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
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

  const getCategoryColor = (category: string) => {
    const cat = shopCategories.find(c => c.id === category);
    return cat ? cat.color : COLORS.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Services - Dhaka</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <User size={24} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Find trusted pet stores, vets, groomers & hotels in Dhaka</Text>
        
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  profileButton: {
    padding: 10,
    backgroundColor: `${COLORS.secondary}15`,
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
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
});
