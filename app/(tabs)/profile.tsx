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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Save, Plus, Trash2, Heart, Bookmark, PawPrint, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/services/profileService';
import { getUserPets, deleteUserPet, UserPet } from '@/lib/services/userPetsService';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  console.log('🔍 [Profile] ProfileScreen component loaded, user:', user?.email || 'NOT SIGNED IN');
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // User's pets
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  
  // Statistics
  const [savedPetsCount, setSavedPetsCount] = useState(0);
  const [nearbyPetsCount, setNearbyPetsCount] = useState(0);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadProfile();
    loadUserPets();
    loadStatistics();
  }, [user]);

  // Refresh pets when screen comes into focus (e.g., after adding a pet)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadUserPets();
        loadStatistics();
      }
    }, [user])
  );

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 [Profile] Loading profile for user:', user.id, user.email);
      
      const { data, error } = await getUserProfile(user.id);

      if (error) {
        console.error('❌ [Profile] Failed to load profile:', error);
        Alert.alert('Error', 'Failed to load profile');
        return;
      }

      if (data) {
        console.log('✅ [Profile] Profile loaded successfully');
        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
      } else {
        // Profile doesn't exist - create it automatically
        console.log('⚠️ [Profile] Profile not found, creating new profile...');
        const { createUserProfile } = await import('@/lib/services/profileService');
        const { data: newProfile, error: createError } = await createUserProfile(
          user.id,
          user.email || '',
          user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user.user_metadata?.phone || ''
        );

        if (createError) {
          console.error('❌ [Profile] Failed to create profile:', createError);
          Alert.alert('Profile Setup Required', 'Please complete your profile setup.');
        } else if (newProfile) {
          console.log('✅ [Profile] Profile created successfully');
          setProfile(newProfile);
          setFullName(newProfile.full_name || '');
          setPhone(newProfile.phone || '');
          setLocation(newProfile.location || '');
        }
      }
    } catch (error) {
      console.error('❌ [Profile] Load profile error:', error);
      Alert.alert('Error', 'An error occurred while loading your profile.');
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

  const loadStatistics = async () => {
    if (!user) return;

    try {
      // Load saved/favorited pets count
      const { supabase } = await import('@/lib/supabase');
      if (supabase) {
        const { data: favorites, error: favError } = await supabase
          .from('pet_favorites')
          .select('id')
          .eq('user_id', user.id);
        
        if (!favError && favorites) {
          setSavedPetsCount(favorites.length);
        }

        // Load nearby pets count based on user location
        if (location) {
          const { data: nearbyPets, error: nearbyError } = await supabase
            .from('pets')
            .select('id')
            .eq('adoption_status', 'available')
            .ilike('location', `%${location}%`)
            .limit(100);
          
          if (!nearbyError && nearbyPets) {
            setNearbyPetsCount(nearbyPets.length);
          }
        } else {
          // If no location set, show total available pets
          const { data: allPets, error: allError } = await supabase
            .from('pets')
            .select('id', { count: 'exact' })
            .eq('adoption_status', 'available');
          
          if (!allError) {
            setNearbyPetsCount(allPets?.length || 0);
          }
        }
      }
    } catch (error) {
      console.error('Load statistics error:', error);
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

  const handleStatusChange = async (petId: string, newStatus: 'available' | 'pending' | 'adopted') => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .update({ adoption_status: newStatus })
        .eq('id', petId);

      if (error) throw error;

      // Update local state
      setUserPets(prev => prev.map(pet => 
        pet.id === petId ? { ...pet, adoption_status: newStatus } : pet
      ));

      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleUploadPhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      // Upload to Supabase Storage
      const imageUri = result.assets[0].uri;
      const fileName = `${user?.id}-${Date.now()}.jpg`;
      
      if (!supabase) {
        Alert.alert('Error', 'Database connection not available');
        return;
      }

      // Different handling for web vs mobile
      let fileData: any;
      
      if (Platform.OS === 'web') {
        // For web, use blob
        const response = await fetch(imageUri);
        fileData = await response.blob();
      } else {
        // For mobile, use ArrayBuffer
        const response = await fetch(imageUri);
        fileData = await response.arrayBuffer();
      }

      // Upload to Supabase storage (using user-avatars bucket)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(fileName, fileData, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert('Upload Failed', `Could not upload image: ${uploadError.message}`);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { data, error } = await updateUserProfile(user!.id, {
        avatar_url: publicUrl,
      });

      if (error) {
        Alert.alert('Error', 'Failed to update profile picture');
        return;
      }

      if (data) {
        setProfile(data);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      Alert.alert('Error', 'Something went wrong while uploading the photo');
    }
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
    if (Platform.OS === 'web') {
      // Use window.confirm for web
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        try {
          console.log('🚪 [Profile] Signing out...');
          const result = await signOut();
          
          if (result.success) {
            console.log('✅ [Profile] Sign out successful, redirecting to welcome screen');
            // Navigate to welcome screen (resets navigation stack)
            if (Platform.OS === 'web') {
              // For web, use window.location to force a full page reload to the root
              window.location.href = '/';
            } else {
              // For mobile, use router.push to navigate to welcome screen
              router.push('/');
            }
          } else {
            console.error('❌ [Profile] Sign out failed:', result.error);
            window.alert(result.error || 'Failed to sign out. Please try again.');
          }
        } catch (error) {
          console.error('❌ [Profile] Sign out error:', error);
          window.alert('Failed to sign out. Please try again.');
        }
      }
    } else {
      // Use Alert.alert for mobile
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
                const result = await signOut();
                
                if (result.success) {
                  console.log('✅ [Profile] Sign out successful, redirecting to welcome screen');
                  // Navigate to welcome screen (resets navigation stack)
                  if (Platform.OS === 'web') {
                    // For web, use window.location to force a full page reload to the root
                    window.location.href = '/';
                  } else {
                    // For mobile, use router.push to navigate to welcome screen
                    router.push('/');
                  }
                } else {
                  console.error('❌ [Profile] Sign out failed:', result.error);
                  Alert.alert('Error', result.error || 'Failed to sign out. Please try again.');
                }
              } catch (error) {
                console.error('❌ [Profile] Sign out error:', error);
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            },
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Guest view - not signed in
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Modern Header */}
        <LinearGradient
          colors={['#FFFFFF', COLORS.secondary + '05', '#F8FAFB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerWhite}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitleDark}>Profile</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Guest Avatar Section with Modern Gradient */}
          <LinearGradient
            colors={['#FFFFFF', COLORS.primary + '08', COLORS.secondary + '05', '#F8FAFB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarSectionGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.guestAvatarCircle}>
                <User size={48} color={COLORS.primary} />
              </View>
            </View>
            <Text style={styles.guestNameText}>Welcome, Guest!</Text>
            <Text style={styles.guestEmailText}>Sign in to unlock all features</Text>
          </LinearGradient>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitleModern}>Sign in to unlock</Text>
            
            {/* Feature Cards with Modern Design */}
            <View style={styles.guestFeatureCard}>
              <View style={styles.guestFeatureIconCircle}>
                <User size={20} color="white" />
              </View>
              <View style={styles.guestFeatureContent}>
                <Text style={styles.guestFeatureTitle}>Manage Your Profile</Text>
                <Text style={styles.guestFeatureDescription}>Edit your personal information and preferences</Text>
              </View>
            </View>

            <View style={styles.guestFeatureCard}>
              <View style={styles.guestFeatureIconCircle}>
                <Plus size={20} color="white" />
              </View>
              <View style={styles.guestFeatureContent}>
                <Text style={styles.guestFeatureTitle}>Add Pets for Adoption</Text>
                <Text style={styles.guestFeatureDescription}>List your pets to find them loving homes</Text>
              </View>
            </View>

            <View style={styles.guestFeatureCard}>
              <View style={styles.guestFeatureIconCircle}>
                <Heart size={20} color="white" />
              </View>
              <View style={styles.guestFeatureContent}>
                <Text style={styles.guestFeatureTitle}>Save Favorite Pets</Text>
                <Text style={styles.guestFeatureDescription}>Keep track of pets you're interested in</Text>
              </View>
            </View>

            <View style={styles.guestFeatureCard}>
              <View style={styles.guestFeatureIconCircle}>
                <User size={20} color="white" />
              </View>
              <View style={styles.guestFeatureContent}>
                <Text style={styles.guestFeatureTitle}>Track Your Activity</Text>
                <Text style={styles.guestFeatureDescription}>See your swipe history and interactions</Text>
              </View>
            </View>
          </View>

          {/* Modern Sign In Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.modernSignInButton}
              onPress={() => router.push('/auth-enhanced')}
              activeOpacity={0.8}
            >
              <View style={styles.modernSignInIconCircle}>
                <User size={20} color="white" />
              </View>
              <View style={styles.modernSignInTextContainer}>
                <Text style={styles.modernSignInText}>Sign In</Text>
                <Text style={styles.modernSignInSubtext}>Access your full profile</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
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
      {/* Modern Header with Subtle Gradient */}
      <LinearGradient
        colors={['#FFFFFF', COLORS.secondary + '05', '#F8FAFB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerWhite}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitleDark}>My Profile</Text>
          {!editing ? (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButtonOutline}
            >
              <Edit2 size={20} color={COLORS.secondary} />
            </TouchableOpacity>
          ) : (
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.saveButtonFilled}
            >
              <TouchableOpacity
                onPress={handleSave}
                style={{ justifyContent: 'center', alignItems: 'center' }}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Save size={20} color="white" />
                )}
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section with Modern Gradient - Compact */}
        <LinearGradient
          colors={['#FFFFFF', COLORS.primary + '08', COLORS.secondary + '05', '#F8FAFB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarSectionGradient}
        >
          <View style={styles.avatarContainer}>
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={[COLORS.primary + '20', COLORS.secondary + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradientBorder}
              >
                <View style={styles.avatarInner}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 46, padding: 1 }}
                  >
                    <View style={{ backgroundColor: '#F8FAFB', borderRadius: 45, padding: 16 }}>
                      <User size={40} color={COLORS.secondary} />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            )}
            {/* Upload Profile Picture Button */}
            <TouchableOpacity 
              style={styles.uploadAvatarButton}
              onPress={handleUploadPhoto}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.fullNameText}>{fullName || 'User'}</Text>
          {(user?.email || profile?.email) && (
            <Text style={styles.emailText}>{user?.email || profile?.email}</Text>
          )}
          <Text style={styles.memberSince}>
            Member since {new Date(profile.created_at || '').toLocaleDateString()}
          </Text>
        </LinearGradient>

        {/* Statistics Section - Compact Single Card */}
        <View style={styles.statsContainerCompact}>
          <View style={styles.statItemCompact}>
            <View style={styles.statIconCompact}>
              <PawPrint size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.statNumberCompact}>{userPets.length}</Text>
            <Text style={styles.statLabelCompact}>My Pets</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItemCompact}>
            <View style={styles.statIconCompact}>
              <Heart size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.statNumberCompact}>{savedPetsCount}</Text>
            <Text style={styles.statLabelCompact}>Liked</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItemCompact}>
            <View style={styles.statIconCompact}>
              <MapPin size={18} color={COLORS.secondary} />
            </View>
            <Text style={styles.statNumberCompact}>{nearbyPetsCount}</Text>
            <Text style={styles.statLabelCompact}>Nearby</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <LinearGradient
              colors={[COLORS.primary + '15', COLORS.primary + '08']}
              style={styles.inputIcon}
            >
              <User size={20} color={COLORS.primary} />
            </LinearGradient>
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
            <LinearGradient
              colors={[COLORS.secondary + '15', COLORS.secondary + '08']}
              style={styles.inputIcon}
            >
              <Mail size={20} color={COLORS.secondary} />
            </LinearGradient>
            <View style={styles.inputContent}>
              <Text style={styles.inputLabel}>Email</Text>
              <Text style={styles.inputValue}>{user?.email || profile.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <LinearGradient
              colors={[COLORS.primary + '15', COLORS.primary + '08']}
              style={styles.inputIcon}
            >
              <Phone size={20} color={COLORS.primary} />
            </LinearGradient>
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
            <LinearGradient
              colors={[COLORS.secondary + '15', COLORS.secondary + '08']}
              style={styles.inputIcon}
            >
              <MapPin size={20} color={COLORS.secondary} />
            </LinearGradient>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity
              style={styles.addPetButtonWrapper}
              onPress={() => {
                router.push('/pet/add');
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.secondary, COLORS.secondaryLight || COLORS.secondary]}
                style={styles.addPetButtonGradient}
              >
                <Plus size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {petsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : userPets.length > 0 ? (
            <>
              <Text style={styles.petsCount}>{userPets.length} pet{userPets.length > 1 ? 's' : ''} listed</Text>
              
              {userPets.map((pet) => (
                <View key={pet.id} style={styles.petItemCard}>
                  <Image
                    source={{ uri: pet.images?.[0] || 'https://via.placeholder.com/80' }}
                    style={styles.petImageRounded}
                  />
                  <View style={styles.petInfoExpanded}>
                    <Text style={styles.petNameBold}>{pet.name}</Text>
                    <Text style={styles.petBreedGray}>{pet.breed} • {pet.age} year{pet.age > 1 ? 's' : ''}</Text>
                    
                    {/* Status Selector */}
                    <View style={styles.statusSelector}>
                      <TouchableOpacity
                        style={[
                          styles.statusOption,
                          pet.adoption_status === 'available' && styles.statusOptionActive
                        ]}
                        onPress={() => handleStatusChange(pet.id, 'available')}
                      >
                        <Text style={[
                          styles.statusOptionText,
                          pet.adoption_status === 'available' && styles.statusOptionTextActive
                        ]}>Available</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.statusOption,
                          pet.adoption_status === 'pending' && styles.statusOptionActive
                        ]}
                        onPress={() => handleStatusChange(pet.id, 'pending')}
                      >
                        <Text style={[
                          styles.statusOptionText,
                          pet.adoption_status === 'pending' && styles.statusOptionTextActive
                        ]}>Pending</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[
                          styles.statusOption,
                          pet.adoption_status === 'adopted' && styles.statusOptionActive
                        ]}
                        onPress={() => handleStatusChange(pet.id, 'adopted')}
                      >
                        <Text style={[
                          styles.statusOptionText,
                          pet.adoption_status === 'adopted' && styles.statusOptionTextActive
                        ]}>Adopted</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.petActionButtons}>
                    <TouchableOpacity
                      style={styles.editPetButton}
                      onPress={() => router.push(`/pet/edit/${pet.id}`)}
                      activeOpacity={0.8}
                    >
                      <Edit2 size={18} color={COLORS.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deletePetButton}
                      onPress={() => handleDeletePet(pet.id, pet.name)}
                      activeOpacity={0.8}
                    >
                      <Trash2 size={18} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.noPetsText}>
              You haven't added any pets yet. Tap + to add your first pet!
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <View style={styles.signOutIconCircle}>
              <LogOut size={20} color="#666" />
            </View>
            <View style={styles.signOutTextContainer}>
              <Text style={styles.signOutText}>Sign Out</Text>
              <Text style={styles.signOutSubtext}>See you soon!</Text>
            </View>
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
  avatarGradientBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 15,
    color: '#555',
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 6,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Nunito-Regular',
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
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
  signOutIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  signOutTextContainer: {
    flex: 1,
  },
  signOutText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  signOutSubtext: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
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
  petActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 2,
  },
  editPetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  deletePetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
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
  guestContainer: {
    flexGrow: 1,
  },
  guestTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    paddingTop: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 20,
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  headerWhite: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleDark: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  editButtonOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonFilled: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSectionGradient: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  uploadAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fullNameText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 3,
    marginTop: 12,
  },
  statsContainerCompact: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItemCompact: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumberCompact: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabelCompact: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E8E8E8',
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addPetButtonCompact: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPetButtonWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  addPetButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EEF2',
  },
  petImageRounded: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  petInfoExpanded: {
    flex: 1,
  },
  petNameBold: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 3,
  },
  petBreedGray: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Nunito-Regular',
    marginBottom: 10,
  },
  statusSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  statusOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#E8EEF2',
    borderWidth: 1,
    borderColor: '#D0DCE5',
  },
  statusOptionActive: {
    backgroundColor: COLORS.secondary + '15',
    borderColor: COLORS.secondary + '40',
  },
  statusOptionText: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
  },
  statusOptionTextActive: {
    color: COLORS.secondary,
  },
  editPetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  // Modern Guest Profile Styles
  guestAvatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  guestNameText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 4,
  },
  guestEmailText: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginBottom: 16,
  },
  sectionTitleModern: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  guestFeatureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  guestFeatureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  guestFeatureContent: {
    flex: 1,
  },
  guestFeatureTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 3,
  },
  guestFeatureDescription: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
    lineHeight: 18,
  },
  modernSignInButton: {
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
  modernSignInIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  modernSignInTextContainer: {
    flex: 1,
  },
  modernSignInText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  modernSignInSubtext: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Nunito-Regular',
  },
});
