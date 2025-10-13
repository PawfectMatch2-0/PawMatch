import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Edit, LogOut, User, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { supabase, authService } from '../../lib/supabase';
import type { UserProfile } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured - using demo data');
        setProfile({
          id: 'demo',
          email: 'demo@example.com',
          full_name: 'Demo User',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preferences: {}
        });
        setLoading(false);
        return;
      }

      const user = await authService.getCurrentUser();
      if (user) {
        const userProfile = await authService.getUserProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // Fallback to creating a profile from user data
          setProfile({
            id: user.id,
            email: user.email || 'No email',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
            preferences: {}
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to demo data on error
      setProfile({
        id: 'demo',
        email: 'demo@example.com',
        full_name: 'Demo User',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        preferences: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
          try {
            if (supabase) {
              await authService.signOut();
            }
            router.replace('/');
          } catch (error) {
            console.error('Logout error:', error);
            router.replace('/');
          }
        }}
      ]
    );
  };

  const stats = [
    { label: 'Saved Pets', value: '12', color: '#FF6B6B' },
    { label: 'Matches', value: '8', color: '#4A90E2' },
    { label: 'Favorites', value: '24', color: '#50C878' }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150' }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Edit size={16} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {profile?.full_name || 'User'}
            </Text>
            <Text style={styles.email}>
              {profile?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <Heart size={16} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF6B6B20' }]}>
                <LogOut size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.menuText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About PawMatch</Text>
          <Text style={styles.aboutText}>
            PawMatch helps you find your perfect furry companion. Swipe through adorable pets, 
            learn about pet care, and connect with local shelters and pet services.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito-Regular',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editButton: {
    position: 'absolute',
    right: -5,
    bottom: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#333',
  },
  aboutSection: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: '#999',
    textAlign: 'center',
  },
});