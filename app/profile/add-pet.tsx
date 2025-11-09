import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Camera, 
  Plus,
  Calendar,
  MapPin,
  User,
  Heart,
  Info
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

export default function AddPetScreen() {
  const router = useRouter();
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState('');
  const [petDescription, setPetDescription] = useState('');
  const [petLocation, setPetLocation] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleAddPhoto = () => {
    // In a real app, this would open camera/photo library
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera pressed') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library pressed') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSavePet = async () => {
    if (!petName || !petBreed || !petAge || !petGender) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!supabase) {
      Alert.alert('Error', 'Database connection not available');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to add a pet');
        return;
      }

      // Create pet record
      const { data, error } = await supabase
        .from('pets')
        .insert({
          name: petName,
          breed: petBreed,
          age: parseInt(petAge) || 0,
          gender: petGender.toLowerCase(),
          size: 'medium', // Default size
          color: '',
          location: petLocation || 'Unknown',
          description: petDescription || `Meet ${petName}, a wonderful ${petBreed}!`,
          personality: ['Friendly', 'Playful'], // Default personality traits
          health_status: 'healthy',
          images: selectedImages.length > 0 ? selectedImages : ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'], // Default image
          adoption_status: 'available',
          owner_id: user.id,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error creating pet:', error);
        Alert.alert('Error', 'Failed to add pet. Please try again.');
        return;
      }

      Alert.alert(
        'Success',
        'Your pet has been added successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => router.back()
          }
        ]
      );

    } catch (error) {
      console.error('Error in handleSavePet:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = ['Male', 'Female'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add Your Pet</Text>
          <Text style={styles.headerSubtitle}>Share your companion with others</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Photos</Text>
          <View style={styles.photoContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Camera size={32} color="#666" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
              
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: image }} style={styles.photoImage} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pet Name *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="Enter your pet's name"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Breed *</Text>
              <View style={styles.inputContainer}>
                <Heart size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  value={petBreed}
                  onChangeText={setPetBreed}
                  placeholder="e.g., Golden Retriever, Persian Cat"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  value={petAge}
                  onChangeText={setPetAge}
                  placeholder="e.g., 2 years, 6 months"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.genderContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderOption,
                      petGender === gender && styles.selectedGenderOption
                    ]}
                    onPress={() => setPetGender(gender)}
                    activeOpacity={0.7}
                  >
                    {petGender === gender ? (
                      <LinearGradient
                        colors={['#FF6F61', '#D32F2F']}
                        style={styles.genderGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={[styles.genderText, styles.selectedGenderText]}>
                          {gender}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.genderOptionInner}>
                        <Text style={styles.genderText}>{gender}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#666" />
                <TextInput
                  style={styles.textInput}
                  value={petLocation}
                  onChangeText={setPetLocation}
                  placeholder="City, Country"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <View style={styles.textAreaContainer}>
                <Info size={20} color="#666" />
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={petDescription}
                  onChangeText={setPetDescription}
                  placeholder="Tell us about your pet's personality, habits, and special needs..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSavePet}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.saveButtonIconCircle}>
              <Plus size={20} color="#FF6F61" strokeWidth={2.5} />
            </View>
            <View style={styles.saveButtonTextContainer}>
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving Pet...' : 'Add Pet to Discover'}
              </Text>
              <Text style={styles.saveButtonSubtext}>Share your companion with others</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#888',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  photoContainer: {
    marginBottom: 8,
  },
  addPhotoButton: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6F61',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    marginRight: 12,
  },
  addPhotoText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#FF6F61',
    marginTop: 8,
  },
  photoItem: {
    position: 'relative',
    marginRight: 12,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 0,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedGenderOption: {
    shadowColor: '#FF6F61',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  genderOptionInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
  },
  genderGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#888',
  },
  selectedGenderText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  actionContainer: {
    marginTop: 32,
    marginBottom: 32,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  saveButtonIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  saveButtonTextContainer: {
    flex: 1,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  saveButtonSubtext: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(213, 217, 217, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
    letterSpacing: 0.3,
    lineHeight: 20,
  },
});