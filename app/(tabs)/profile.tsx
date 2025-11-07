/**
 * User Profile Screen
 * Displays and allows editing of user profile information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Save, Plus, Trash2 } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/services/profileService';
import { getUserPets, deleteUserPet, UserPet } from '@/lib/services/userPetsService';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // User's pets
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadProfile();
    loadUserPets();
  }, [user]);

  // Refresh pets when screen comes into focus (e.g., after adding a pet)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadUserPets();
      }
    }, [user])
  );

  const loadProfile = async () => {
    if (!user) {
      router.replace('/auth');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await getUserProfile(user.id);

      if (error) {
        console.error('Failed to load profile:', error);
        Alert.alert('Error', 'Failed to load profile');
        return;
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
      }
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPets = async () => {
    if (!user) return;

    try {
      setPetsLoading(true);
      const { data, error } = await getUserPets(user.id);

      if (error) {
        console.error('Failed to load user pets:', error);
      } else if (data) {
        setUserPets(data);
      }
    } catch (error) {
      console.error('Load user pets error:', error);
    } finally {
      setPetsLoading(false);
    }
  };

  const handleDeletePet = async (petId: string, petName: string) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${petName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { success, error } = await deleteUserPet(petId);
            if (success) {
              Alert.alert('Success', `${petName} has been deleted`);
              loadUserPets(); // Refresh list
            } else {
              Alert.alert('Error', 'Failed to delete pet');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { data, error } = await updateUserProfile(user.id, {
        full_name: fullName,
        phone: phone,
        location: location,
      });

      if (error) {
        Alert.alert('Error', 'Failed to update profile');
        return;
      }

      if (data) {
        setProfile(data);
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          {!editing ? (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButton}
            >
              <Edit2 size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Save size={20} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={60} color={COLORS.primary} />
              </View>
            )}
          </View>
          <Text style={styles.emailText}>{profile.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(profile.created_at || '').toLocaleDateString()}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <User size={20} color={COLORS.primary} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Full Name</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.inputValue}>{fullName || 'Not set'}</Text>
              )}
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={COLORS.primary} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.inputValue}>{profile.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <Phone size={20} color={COLORS.primary} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Phone</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.inputValue}>{phone || 'Not set'}</Text>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIcon}>
              <MapPin size={20} color={COLORS.primary} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Location</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.inputValue}>{location || 'Not set'}</Text>
              )}
            </View>
          </View>
        </View>

        {/* My Pets Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => {
              router.push('/pet/add');
            }}
          >
            <Plus size={20} color={COLORS.primary} />
            <Text style={styles.addPetText}>Add Pet for Adoption</Text>
          </TouchableOpacity>
          
          {petsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : userPets.length > 0 ? (
            <>
              <Text style={styles.petsCount}>{userPets.length} pet{userPets.length > 1 ? 's' : ''} listed</Text>
              
              {userPets.map((pet) => (
                <View key={pet.id} style={styles.petItem}>
                  <Image
                    source={{ uri: pet.images?.[0] || 'https://via.placeholder.com/80' }}
                    style={styles.petImage}
                  />
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed} • {pet.age} years</Text>
                    <View style={styles.petStatus}>
                      <View style={[
                        styles.statusBadge,
                        pet.adoption_status === 'available' && styles.statusAvailable,
                        pet.adoption_status === 'pending' && styles.statusPending,
                        pet.adoption_status === 'adopted' && styles.statusAdopted,
                      ]}>
                        <Text style={styles.statusText}>
                          {pet.adoption_status.charAt(0).toUpperCase() + pet.adoption_status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deletePetButton}
                    onPress={() => handleDeletePet(pet.id, pet.name)}
                  >
                    <Trash2 size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noPetsText}>
              You haven't added any pets yet. Click above to add your first pet!
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#F44336" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
    fontFamily: 'Nunito-Regular',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Nunito-Regular',
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Nunito-SemiBold',
    padding: 0,
  },
  inputValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Nunito-SemiBold',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFEBEE',
  },
  signOutText: {
    fontSize: 16,
    color: '#F44336',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  addPetText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  petsCount: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito-SemiBold',
    marginTop: 16,
    marginBottom: 12,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  petInfo: {
    flex: 1,
    marginLeft: 12,
  },
  petName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 8,
  },
  petStatus: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusAvailable: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusAdopted: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
  },
  deletePetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  noPetsText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  addPetHint: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
