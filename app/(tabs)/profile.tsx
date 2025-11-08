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
import { User, Mail, Phone, MapPin, Edit2, LogOut, Save, Plus, Trash2, Heart, Bookmark, PawPrint } from 'lucide-react-native';
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
          await signOut();
          console.log('✅ [Profile] Sign out successful, redirecting to welcome screen');
          router.replace('/');
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
                await signOut();
                console.log('✅ [Profile] Sign out successful, redirecting to welcome screen');
                router.replace('/');
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
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.guestContainer}>
          {/* Guest Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <User size={60} color={COLORS.primary} />
              </View>
            </View>
            <Text style={styles.guestTitle}>Welcome, Guest!</Text>
            <Text style={styles.guestSubtitle}>Sign in to access your profile and features</Text>
          </View>

          {/* Guest Features List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sign in to unlock:</Text>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFE8E8' }]}>
                <User size={20} color={COLORS.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Manage Your Profile</Text>
                <Text style={styles.featureDescription}>Edit your personal information and preferences</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFE8E8' }]}>
                <Plus size={20} color={COLORS.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Add Pets for Adoption</Text>
                <Text style={styles.featureDescription}>List your pets to find them loving homes</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFE8E8' }]}>
                <Text style={styles.featureIconText}>❤️</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Save Favorite Pets</Text>
                <Text style={styles.featureDescription}>Keep track of pets you're interested in</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFE8E8' }]}>
                <Text style={styles.featureIconText}>🐾</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Track Your Interactions</Text>
                <Text style={styles.featureDescription}>See your swipe history and matches</Text>
              </View>
            </View>
          </View>

          {/* Sign In Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push('/auth-enhanced')}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.signInGradient}
              >
                <Text style={styles.signInButtonText}>Sign In to Continue</Text>
              </LinearGradient>
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
        {/* Avatar Section with Modern Gradient */}
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
                    style={{ borderRadius: 56, padding: 1 }}
                  >
                    <View style={{ backgroundColor: '#F8FAFB', borderRadius: 55, padding: 20 }}>
                      <User size={50} color={COLORS.secondary} />
                    </View>
                  </LinearGradient>
                </View>
              </LinearGradient>
            )}
          </View>
          <Text style={styles.fullNameText}>{fullName || 'User'}</Text>
          <Text style={styles.emailText}>{profile.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(profile.created_at || '').toLocaleDateString()}
          </Text>
        </LinearGradient>

        {/* Statistics Section - Primary & Secondary Colors */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.secondary + '20', COLORS.secondary + '10']}
              style={styles.statIconCircle}
            >
              <PawPrint size={20} color={COLORS.secondary} />
            </LinearGradient>
            <Text style={styles.statNumber}>{userPets.length}</Text>
            <Text style={styles.statLabel}>My Pets</Text>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.primary + '20', COLORS.primary + '10']}
              style={styles.statIconCircle}
            >
              <Heart size={20} color={COLORS.primary} />
            </LinearGradient>
            <Text style={styles.statNumber}>{savedPetsCount}</Text>
            <Text style={styles.statLabel}>Liked</Text>
          </View>

          <View style={styles.statCard}>
            <LinearGradient
              colors={[COLORS.secondary + '20', COLORS.secondary + '10']}
              style={styles.statIconCircle}
            >
              <MapPin size={20} color={COLORS.secondary} />
            </LinearGradient>
            <Text style={styles.statNumber}>{nearbyPetsCount}</Text>
            <Text style={styles.statLabel}>Nearby</Text>
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
              <Text style={styles.inputValue}>{profile.email}</Text>
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
              style={styles.addPetButtonCompact}
              onPress={() => {
                router.push('/pet/add');
              }}
            >
              <Plus size={18} color={COLORS.secondary} />
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
                  
                  <TouchableOpacity
                    style={styles.editPetButton}
                    onPress={() => router.push(`/pet/edit/${pet.id}`)}
                  >
                    <Edit2 size={18} color={COLORS.secondary} />
                  </TouchableOpacity>
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
    paddingVertical: 30,
    marginBottom: 16,
  },
  fullNameText: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
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
});
