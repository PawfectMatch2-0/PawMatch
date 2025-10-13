import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LegacyAuthCallback() {
  const router = useRouter();
  
  useEffect(() => {
    // This handles the legacy /assets/web/auth-callback.html route
    // and redirects to the new /auth-callback route
    
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace('/assets/web/auth-callback', '/auth-callback');
      
      console.log('🔄 Redirecting from legacy auth callback URL');
      console.log('📍 From:', currentUrl);
      console.log('📍 To:', newUrl);
      
      // Redirect to the new auth callback route
      setTimeout(() => {
        window.location.replace(newUrl);
      }, 100);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔄 Redirecting to auth callback...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});