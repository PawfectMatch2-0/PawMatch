/**
 * Test OAuth callback - helps debug redirect URI issues
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TestOAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    console.log('🧪 [Test Callback] Route hit! All params:', params);
    console.log('🧪 [Test Callback] URL fragments and query params received');
    
    // Log all available parameters
    Object.keys(params).forEach(key => {
      console.log(`🧪 [Test Callback] ${key}:`, params[key]);
    });
    
    // Wait 3 seconds then redirect back
    setTimeout(() => {
      router.push('/auth');
    }, 3000);
  }, [params]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 OAuth Test Callback</Text>
      <Text style={styles.subtitle}>Check terminal for debug logs</Text>
      <Text style={styles.info}>Redirecting back in 3 seconds...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#999',
  },
});