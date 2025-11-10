/**
 * Edit Pet Screen
 * Allows users to edit their pet's information
 */

import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Camera, Save } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface PetData {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color?: string;
  personality?: string[];
  description?: string;
  location?: string;
  images?: string[];
  contact_info?: any;
  adoption_status: 'available' | 'pending' | 'adopted';
}

export default function EditPetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pet, setPet] = useState<PetData | null>(null);
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
  const [adoptionStatus, setAdoptionStatus] = useState<'available' | 'pending' | 'adopted'>('available');
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);

  const personalityOptions = [
    'Friendly', 'Playful', 'Calm', 'Energetic', 'Loyal',
    'Gentle', 'Protective', 'Independent', 'Affectionate', 'Smart'
  ];

  useEffect(() => {
    loadPetData();
  }, [id]);

  const loadPetData = async () => {
    if (!supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setPet(data);
        setName(data.name || '');
        setBreed(data.breed || '');
        setAge(data.age?.toString() || '');
        setGender(data.gender || 'male');
        setSize(data.size || 'medium');
        setColor(data.color || '');
        setDescription(data.description || '');
        setLocation(data.location || '');
        setAdoptionStatus(data.adoption_status || 'available');
        setPhone(data.contact_info?.phone || '');
        setSelectedPersonality(data.personality || []);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading pet:', error);
      Alert.alert('Error', 'Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    if (!supabase || !user || !id) return;

    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        name: name.trim(),
        breed: breed.trim(),
        age: Number(age),
        gender,
        size,
        color: color.trim() || null,
        personality: selectedPersonality.length > 0 ? selectedPersonality : null,
        description: description.trim() || null,
        location: location.trim() || null,
        contact_info: phone.trim() ? { phone: phone.trim() } : null,
        adoption_status: adoptionStatus,
        images: images,
      };

      const { error: updateError } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      Alert.alert(
        'Success! 🎉',
        `${name}'s information has been updated successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Update pet error:', error);
      Alert.alert('Error', 'Failed to update pet information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Pet not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.secondary, COLORS.secondaryLight]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit {pet.name}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Save size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
                <Camera size={32} color={COLORS.secondary} />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Adoption Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Status</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.statusButton, adoptionStatus === 'available' && styles.statusButtonActive]}
              onPress={() => setAdoptionStatus('available')}
            >
              <Text style={[styles.optionText, adoptionStatus === 'available' && styles.optionTextActive]}>
                Available
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, adoptionStatus === 'pending' && styles.statusButtonActive]}
              onPress={() => setAdoptionStatus('pending')}
            >
              <Text style={[styles.optionText, adoptionStatus === 'pending' && styles.optionTextActive]}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusButton, adoptionStatus === 'adopted' && styles.statusButtonActive]}
              onPress={() => setAdoptionStatus('adopted')}
            >
              <Text style={[styles.optionText, adoptionStatus === 'adopted' && styles.optionTextActive]}>
                Adopted
              </Text>
            </TouchableOpacity>
          </View>
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
            >
              <Text style={[styles.optionText, gender === 'male' && styles.optionTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, gender === 'female' && styles.optionButtonActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.optionText, gender === 'female' && styles.optionTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Size *</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, size === 'small' && styles.optionButtonActive]}
              onPress={() => setSize('small')}
            >
              <Text style={[styles.optionText, size === 'small' && styles.optionTextActive]}>
                Small
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'medium' && styles.optionButtonActive]}
              onPress={() => setSize('medium')}
            >
              <Text style={[styles.optionText, size === 'medium' && styles.optionTextActive]}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, size === 'large' && styles.optionButtonActive]}
              onPress={() => setSize('large')}
            >
              <Text style={[styles.optionText, size === 'large' && styles.optionTextActive]}>
                Large
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personality Traits</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>

          <View style={styles.personalityContainer}>
            {personalityOptions.map((trait) => (
              <TouchableOpacity
                key={trait}
                style={[
                  styles.personalityTag,
                  selectedPersonality.includes(trait) && styles.personalityTagActive
                ]}
                onPress={() => togglePersonality(trait)}
              >
                <Text style={[
                  styles.personalityText,
                  selectedPersonality.includes(trait) && styles.personalityTextActive
                ]}>
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
            placeholder="Tell us more about your pet..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Contact & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Location</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., New York, NY"
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
              placeholder="e.g., +1 234 567 8900"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito-Regular',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    fontFamily: 'Nunito-SemiBold',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Nunito-Regular',
    marginBottom: 16,
  },
  imagesScroll: {
    marginTop: 8,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary + '40',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary + '08',
  },
  addImageText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontFamily: 'Nunito-SemiBold',
    marginTop: 8,
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  row: {
    flexDirection: 'row',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  optionTextActive: {
    color: COLORS.secondary,
  },
  personalityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  personalityTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  personalityTagActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  personalityText: {
    fontSize: 13,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  personalityTextActive: {
    color: COLORS.secondary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 100,
  },
});
