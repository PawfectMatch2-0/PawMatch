import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Edit, Settings, Heart, MessageSquare, Shield, LogOut, Mail, Phone, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleAccountSettings = () => {
    router.push('/profile/account-settings');
  };

  const handleAppSettings = () => {
    router.push('/profile/app-settings');
  };

  const handleAddPet = () => {
    router.push('/profile/add-pet');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle logout logic here
          router.replace('/auth');
        }}
      ]
    );
  };

  const profileStats = [
    { label: 'Saved Pets', value: '12', icon: Heart },
    { label: 'Applications', value: '3', icon: MessageSquare },
    { label: 'Reviews', value: '8', icon: Shield },
  ];

  const menuItems = [
    {
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: Edit,
      onPress: handleEditProfile,
      color: '#4A90E2'
    },
    {
      title: 'Add My Pet',
      subtitle: 'List your pet for adoption',
      icon: Heart,
      onPress: handleAddPet,
      color: '#FF6B6B'
    },
    {
      title: 'Account Settings',
      subtitle: 'Privacy, security, and preferences',
      icon: Settings,
      onPress: handleAccountSettings,
      color: '#50C878'
    },
    {
      title: 'App Settings',
      subtitle: 'Notifications and app preferences',
      icon: Shield,
      onPress: handleAppSettings,
      color: '#9B59B6'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.profileGradient}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editImageButton}>
                <Edit size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <View style={styles.profileDetails}>
                <View style={styles.profileDetailItem}>
                  <Mail size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.profileDetailText}>john.doe@email.com</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <Phone size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.profileDetailText}>+880 1234-567890</Text>
                </View>
                <View style={styles.profileDetailItem}>
                  <MapPin size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.profileDetailText}>Dhaka, Bangladesh</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.icon === Heart ? '#FF6B6B' : stat.icon === MessageSquare ? '#4A90E2' : '#50C878'}20` }]}>
                <stat.icon size={20} color={stat.icon === Heart ? '#FF6B6B' : stat.icon === MessageSquare ? '#4A90E2' : '#50C878'} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.menuArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PawMatch v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with ❤️ for pet lovers</Text>
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
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  profileHeader: {
    marginBottom: 20,
  },
  profileGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 12,
  },
  profileDetails: {
    alignItems: 'center',
    gap: 6,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileDetailText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  menuArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#CCC',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999',
  },
});
