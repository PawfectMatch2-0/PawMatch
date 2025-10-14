/**
 * ADOPTION APPLICATION FORM
 * Complete application form for pet adoption
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { AdoptionApplication } from '../../lib/adoption-flow';

export default function AdoptionApplicationScreen() {
  const router = useRouter();
  const { petId, petName } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    employment_status: '',
    housing_type: 'house' as 'house' | 'apartment' | 'condo' | 'other',
    has_yard: false,
    other_pets: '',
    experience_with_pets: '',
    why_adopt: '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const required = ['full_name', 'email', 'phone', 'address', 'employment_status', 'why_adopt'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        Alert.alert('Missing Information', `Please fill in your ${field.replace('_', ' ')}`);
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const submitApplication = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual API call
      const application: Partial<AdoptionApplication> = {
        user_id: 'current_user_id', // Get from auth
        pet_id: petId as string,
        status: 'application_sent',
        applicant_info: formData,
        applied_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Application submitted:', application);

      Alert.alert(
        'Application Submitted!',
        `Your adoption application for ${petName} has been sent to the shelter. You'll hear back soon!`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/saved')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adoption Application</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.petInfo}>
              Applying to adopt: <Text style={styles.petName}>{petName}</Text>
            </Text>

            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={formData.full_name}
                onChangeText={(value) => updateField('full_name', value)}
                autoCapitalize="words"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email Address *"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Full Address *"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Living Situation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Living Situation</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Employment Status *"
                value={formData.employment_status}
                onChangeText={(value) => updateField('employment_status', value)}
              />

              {/* Housing Type Selector */}
              <Text style={styles.fieldLabel}>Housing Type *</Text>
              <View style={styles.radioGroup}>
                {['house', 'apartment', 'condo', 'other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.radioOption,
                      formData.housing_type === type && styles.radioOptionSelected
                    ]}
                    onPress={() => updateField('housing_type', type)}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.housing_type === type && styles.radioTextSelected
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Yard Question */}
              <Text style={styles.fieldLabel}>Do you have a yard?</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    formData.has_yard && styles.radioOptionSelected
                  ]}
                  onPress={() => updateField('has_yard', true)}
                >
                  <Text style={[
                    styles.radioText,
                    formData.has_yard && styles.radioTextSelected
                  ]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioOption,
                    !formData.has_yard && styles.radioOptionSelected
                  ]}
                  onPress={() => updateField('has_yard', false)}
                >
                  <Text style={[
                    styles.radioText,
                    !formData.has_yard && styles.radioTextSelected
                  ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Pet Experience */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pet Experience</Text>
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Do you currently have other pets? (Describe them)"
                value={formData.other_pets}
                onChangeText={(value) => updateField('other_pets', value)}
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your experience with pets"
                value={formData.experience_with_pets}
                onChangeText={(value) => updateField('experience_with_pets', value)}
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Why do you want to adopt this pet? *"
                value={formData.why_adopt}
                onChangeText={(value) => updateField('why_adopt', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={submitApplication}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Text>
            {!loading && <Send size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  petInfo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  petName: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  radioOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  radioOptionSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  radioText: {
    fontSize: 14,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});