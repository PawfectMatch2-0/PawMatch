/**
 * Add Pet Screen
 * Allows users to upload their own pets for adoption
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X, Plus, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { createUserPet, uploadPetImages, CreatePetData } from '@/lib/services/userPetsService';
import { supabase } from '@/lib/supabase';

export default function AddPetScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Form fields
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);

  const personalityOptions = [
    'Friendly', 'Playful', 'Calm', 'Energetic', 'Loyal',
    'Gentle', 'Protective', 'Independent', 'Affectionate', 'Smart'
  ];

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Limit Reached', 'You can upload maximum 5 images');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const togglePersonality = (trait: string) => {
    if (selectedPersonality.includes(trait)) {
      setSelectedPersonality(selectedPersonality.filter(t => t !== trait));
    } else {
      setSelectedPersonality([...selectedPersonality, trait]);
    }
  };

  const validateForm = () => {
    if (!name.trim()) return 'Please enter pet name';
    if (!breed.trim()) return 'Please enter breed';
    if (!age || isNaN(Number(age)) || Number(age) <= 0) return 'Please enter valid age';
    if (images.length === 0) return 'Please add at least one image';
    return null;
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a pet');
      return;
    }

    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      setLoading(true);

      // First, create the pet record without images
      const petData: CreatePetData = {
        name: name.trim(),
        breed: breed.trim(),
        age: Number(age),
        gender,
        size,
        color: color.trim() || undefined,
        personality: selectedPersonality.length > 0 ? selectedPersonality : undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        contact_info: phone.trim() ? { phone: phone.trim() } : undefined,
      };

      const { data: pet, error: createError } = await createUserPet(user.id, petData);

      if (createError || !pet) {
        Alert.alert('Error', 'Failed to create pet listing');
        return;
      }

      // Upload images
      const { urls, error: uploadError } = await uploadPetImages(pet.id, images);

      if (!uploadError && urls.length > 0 && supabase) {
        // Update pet with image URLs
        await supabase
          .from('pets')
          .update({ images: urls })
          .eq('id', pet.id);
      }

      Alert.alert(
        'Success! 🎉',
        `${name} has been added successfully and will appear in the discover feed!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Add pet error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add Your Pet</Text>
          <Text style={styles.headerSubtitle}>Share your companion with others</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Photos *</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 photos</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Camera size={32} color={COLORS.primary} />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Buddy"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="e.g., Golden Retriever"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Age (years) *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="e.g., 2"
                keyboardType="number-pad"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="e.g., Brown"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Gender & Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender & Size</Text>

          <Text style={styles.label}>Gender *</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'male' && styles.optionButtonActive]}
              onPress={() => setGender('male')}
              activeOpacity={0.7}
            >
              {gender === 'male' ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.optionText, styles.optionTextActive]}>
                    Male
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionButtonInner}>
                  <Text style={styles.optionText}>Male</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'female' && styles.optionButtonActive]}
              onPress={() => setGender('female')}
              activeOpacity={0.7}
            >
              {gender === 'female' ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.optionText, styles.optionTextActive]}>
                    Female
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionButtonInner}>
                  <Text style={styles.optionText}>Female</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Size *</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, size === 'small' && styles.optionButtonActive]}
              onPress={() => setSize('small')}
              activeOpacity={0.7}
            >
              {size === 'small' ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.optionText, styles.optionTextActive]}>
                    Small
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionButtonInner}>
                  <Text style={styles.optionText}>Small</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'medium' && styles.optionButtonActive]}
              onPress={() => setSize('medium')}
              activeOpacity={0.7}
            >
              {size === 'medium' ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.optionText, styles.optionTextActive]}>
                    Medium
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionButtonInner}>
                  <Text style={styles.optionText}>Medium</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'large' && styles.optionButtonActive]}
              onPress={() => setSize('large')}
              activeOpacity={0.7}
            >
              {size === 'large' ? (
                <LinearGradient
                  colors={COLORS.gradients.primary}
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.optionText, styles.optionTextActive]}>
                    Large
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.optionButtonInner}>
                  <Text style={styles.optionText}>Large</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Personality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality Traits</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>

          <View style={styles.personalityGrid}>
            {personalityOptions.map((trait) => (
              <TouchableOpacity
                key={trait}
                style={[
                  styles.personalityChip,
                  selectedPersonality.includes(trait) && styles.personalityChipActive,
                ]}
                onPress={() => togglePersonality(trait)}
              >
                <Text
                  style={[
                    styles.personalityText,
                    selectedPersonality.includes(trait) && styles.personalityTextActive,
                  ]}
                >
                  {trait}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about your pet's personality, habits, and what makes them special..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., New York, USA"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp Number *</Text>
            <Text style={styles.helperText}>
              📱 This will be used for WhatsApp contact button
            </Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g., +1234567890"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.submitButtonWrapper, loading && styles.submitButtonDisabled]}
            activeOpacity={0.8}
          >
            <View style={styles.submitButtonIconCircle}>
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
              )}
            </View>
            <View style={styles.submitButtonTextContainer}>
              <Text style={styles.submitButtonText}>
                {loading ? 'Adding Pet...' : 'Add Pet to Discover'}
              </Text>
              <Text style={styles.submitButtonSubtext}>Share your companion with others</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  closeButton: {
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#999',
    marginBottom: 16,
  },
  imagesScroll: {
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#25D366',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionButtonActive: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  optionButtonInner: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#888',
  },
  optionTextActive: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  optionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personalityChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  personalityChipActive: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  personalityText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#888',
  },
  personalityTextActive: {
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    minHeight: 100,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  submitButtonWrapper: {
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
  submitButtonIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  submitButtonTextContainer: {
    flex: 1,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  submitButtonSubtext: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
});
