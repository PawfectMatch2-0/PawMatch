import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function AuthCallbackHTML() {
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      // Remove .html extension and redirect to the proper route
      const newUrl = currentUrl.replace('/assets/web/auth-callback.html', '/auth-callback');
      
      console.log('🔄 Legacy redirect activated');
      console.log('📍 From:', currentUrl);
      console.log('📍 To:', newUrl);
      
      // Immediate redirect
      window.location.replace(newUrl);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.text}>🔄 Redirecting to auth callback...</Text>
      <Text style={styles.subtext}>Please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});