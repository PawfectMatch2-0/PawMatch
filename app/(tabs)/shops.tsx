import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MapPin, Star, Phone, User, Stethoscope, Scissors, GraduationCap, Store } from 'lucide-react-native';

// Shop categories
const shopCategories = [
  { id: 'all', name: 'All', icon: Store, color: '#FF6B6B' },
  { id: 'Pet Store', name: 'Pet Store', icon: Store, color: '#4A90E2' },
  { id: 'Veterinary', name: 'Veterinary', icon: Stethoscope, color: '#50C878' },
  { id: 'Grooming', name: 'Grooming', icon: Scissors, color: '#9B59B6' },
  { id: 'Training', name: 'Training', icon: GraduationCap, color: '#FF8C00' },
];

// Mock pet shops data
const mockPetShops = [
  {
    id: '1',
    name: 'Happy Paws Pet Store',
    category: 'Pet Store',
    rating: 4.8,
    reviews: 124,
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=400&h=300',
    address: 'Dhanmondi, Dhaka',
    phone: '+880 1234-567890',
    hours: 'Open • Closes 10 PM',
    specialties: ['Pet Food', 'Toys', 'Accessories']
  },
  {
    id: '2',
    name: 'City Veterinary Clinic',
    category: 'Veterinary',
    rating: 4.9,
    reviews: 89,
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=400&h=300',
    address: 'Gulshan, Dhaka',
    phone: '+880 1234-567891',
    hours: 'Open • 24 Hours',
    specialties: ['Emergency Care', 'Surgery', 'Vaccination']
  },
  {
    id: '3',
    name: 'Pawsome Grooming',
    category: 'Grooming',
    rating: 4.7,
    reviews: 156,
    distance: '2.1 km',
    image: 'https://images.unsplash.com/photo-1559190394-90caa8fc893c?auto=format&fit=crop&w=400&h=300',
    address: 'Uttara, Dhaka',
    phone: '+880 1234-567892',
    hours: 'Open • Closes 8 PM',
    specialties: ['Bath & Brush', 'Nail Trimming', 'Styling']
  },
  {
    id: '4',
    name: 'Pet Paradise Training',
    category: 'Training',
    rating: 4.6,
    reviews: 67,
    distance: '3.5 km',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&h=300',
    address: 'Bashundhara, Dhaka',
    phone: '+880 1234-567893',
    hours: 'Open • Closes 6 PM',
    specialties: ['Obedience Training', 'Puppy Classes', 'Behavior']
  }
];

export default function ShopsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredShops, setFilteredShops] = useState(mockPetShops);

  const filterShopsByCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredShops(mockPetShops);
    } else {
      setFilteredShops(mockPetShops.filter(shop => shop.category === categoryId));
    }
  };

  const handleShopPress = (shopId: string) => {
    // Navigate to shop details (placeholder for now)
    console.log('Shop pressed:', shopId);
  };

  const handleCall = (phone: string) => {
    console.log('Call:', phone);
  };

  const renderShopItem = ({ item }: { item: typeof mockPetShops[0] }) => (
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
        
        <Text style={styles.hours} numberOfLines={1}>{item.hours}</Text>
        
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
    return cat ? cat.color : '#FF6B6B';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Pet Shops & Services</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <User size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Discover nearby pet stores, clinics, and services</Text>
        
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
    color: '#FF6B6B',
    letterSpacing: -0.5,
  },
  profileButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
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
    backgroundColor: '#FF6B6B',
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
