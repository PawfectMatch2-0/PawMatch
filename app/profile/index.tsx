/**
 * User Profile Screen
 * Displays and allows editing of user profile information
 */

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Save, Plus, Trash2, Camera, Heart } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile, uploadAvatar, UserProfile } from '@/lib/services/profileService';
import { getUserPets, deleteUserPet, UserPet } from '@/lib/services/userPetsService';
import { getUserStats, UserStats } from '@/lib/services/statsService';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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
  
  // User statistics
  const [stats, setStats] = useState<UserStats>({
    likedPetsCount: 0,
    myPetsCount: 0,
    nearbyPetsCount: 0,
  });
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadProfile();
    loadUserPets();
    loadUserStats();
  }, [user]);

  // Refresh pets and stats when screen comes into focus (e.g., after adding a pet)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadUserPets();
        loadUserStats();
      }
    }, [user])
  );

  const loadProfile = async () => {
    if (!user) {
      router.replace('/');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 [Profile] Loading profile for user:', user.id);
      
      const { data, error } = await getUserProfile(user.id);

      // Handle errors gracefully
      if (error) {
        console.error('❌ [Profile] Failed to load profile:', error);
        
        // Create a basic profile from user session data
        const basicProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Pet Lover',
          phone: user.user_metadata?.phone || '',
          location: '',
          created_at: new Date().toISOString(),
        };
        
        setProfile(basicProfile);
        setFullName(basicProfile.full_name || '');
        setPhone(basicProfile.phone || '');
        setLocation('');
        
        console.log('✅ [Profile] Using session data as fallback');
        return;
      }

      // Profile doesn't exist in database - create it
      if (!data) {
        console.log('📝 [Profile] No profile found in database, creating from session data...');
        
        const basicProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Pet Lover',
          phone: user.user_metadata?.phone || '',
          location: '',
          created_at: new Date().toISOString(),
        };
        
        // Try to create profile in database using upsert
        const { error: createError } = await updateUserProfile(
          user.id,
          {
            email: basicProfile.email,
            full_name: basicProfile.full_name,
            phone: basicProfile.phone,
            location: basicProfile.location,
          },
          basicProfile.email // Pass email explicitly for first creation
        );

        if (createError) {
          console.warn('⚠️ [Profile] Could not create profile in database, using session data:', createError);
        } else {
          console.log('✅ [Profile] Profile created in database successfully');
        }

        setProfile(basicProfile);
        setFullName(basicProfile.full_name || '');
        setPhone(basicProfile.phone || '');
        setLocation('');
        return;
      }

      // Profile loaded successfully
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        console.log('✅ [Profile] Profile loaded successfully');
      }
    } catch (error) {
      console.error('💥 [Profile] Load profile error:', error);
      
      // Fallback to session data
      const basicProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        phone: '',
        location: '',
        created_at: new Date().toISOString(),
      };
      setProfile(basicProfile);
      setFullName(basicProfile.full_name || '');
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

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await getUserStats(user.id);

      if (error) {
        console.error('Failed to load user stats:', error);
      } else if (data) {
        setStats(data);
        console.log('✅ [Profile] Stats loaded:', data);
      }
    } catch (error) {
      console.error('Load user stats error:', error);
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
              loadUserStats(); // Refresh stats
            } else {
              Alert.alert('Error', 'Failed to delete pet');
            }
          },
        },
      ]
    );
  };

  const handleUploadAvatar = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photos');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        setUploadingAvatar(true);

        // Upload to Supabase
        const { url, error } = await uploadAvatar(user!.id, uri);

        if (error || !url) {
          Alert.alert('Upload Failed', 'Failed to upload avatar image');
          setUploadingAvatar(false);
          return;
        }

        // Update profile with new avatar URL
        const { data, error: updateError } = await updateUserProfile(user!.id, {
          avatar_url: url,
        });

        setUploadingAvatar(false);

        if (updateError) {
          Alert.alert('Error', 'Failed to update profile with new avatar');
        } else {
          setProfile({ ...profile!, avatar_url: url });
          Alert.alert('Success', 'Avatar updated successfully!');
        }
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setUploadingAvatar(false);
      Alert.alert('Error', 'Something went wrong while uploading avatar');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const updates = {
        email: profile?.email || user.email || '',
        full_name: fullName,
        phone: phone,
        location: location,
      };

      const { data, error } = await updateUserProfile(user.id, updates);

      // Even if there's an error, the service now returns the data as fallback
      if (data) {
        setProfile({ ...profile!, ...data });
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        // Should not reach here with new upsert logic
        Alert.alert('Error', 'Failed to update profile');
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
            try {
              console.log('🚪 [Profile] Signing out...');
              await signOut();
              console.log('✅ [Profile] Sign out successful, redirecting to welcome screen');
              // Navigate to welcome/splash screen (index.tsx)
              router.replace('/');
            } catch (error) {
              console.error('❌ [Profile] Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
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
        colors={COLORS.gradients.secondary}
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
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleUploadAvatar}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="large" color={COLORS.secondary} />
              </View>
            ) : profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={60} color={COLORS.secondary} />
              </View>
            )}
            {!uploadingAvatar && (
              <View style={styles.cameraButton}>
                <Camera size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.emailText}>{profile.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(profile.created_at || '').toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={handleUploadAvatar} disabled={uploadingAvatar}>
            <Text style={styles.changePhotoText}>
              {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <TouchableOpacity style={styles.statItem} onPress={() => router.push('/(tabs)/saved')}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFE8F0' }]}>
              <Heart size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{stats.likedPetsCount}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E8F5F9' }]}>
              <User size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.statNumber}>{stats.myPetsCount}</Text>
            <Text style={styles.statLabel}>My Pets</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFE8F0' }]}>
              <MapPin size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumber}>{stats.nearbyPetsCount}</Text>
            <Text style={styles.statLabel}>Nearby</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputIcon, { backgroundColor: '#E8F5F9' }]}>
              <User size={20} color={COLORS.secondary} />
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
            <View style={[styles.inputIcon, { backgroundColor: '#E8F5F9' }]}>
              <Mail size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.inputValue}>{profile.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputIcon, { backgroundColor: '#E8F5F9' }]}>
              <Phone size={20} color={COLORS.secondary} />
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
            <View style={[styles.inputIcon, { backgroundColor: '#E8F5F9' }]}>
              <MapPin size={20} color={COLORS.secondary} />
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
            <Plus size={20} color={COLORS.secondary} />
            <Text style={styles.addPetText}>Add Pet for Adoption</Text>
          </TouchableOpacity>
          
          {petsLoading ? (
              <ActivityIndicator size="small" color={COLORS.secondary} style={{ marginTop: 20 }} />
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
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.secondary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.secondary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  changePhotoText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: 'Nunito-SemiBold',
    marginTop: 8,
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
    backgroundColor: '#E8F5F9',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    marginBottom: 12,
  },
  addPetText: {
    fontSize: 16,
    color: COLORS.secondary,
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
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 12,
  },
});