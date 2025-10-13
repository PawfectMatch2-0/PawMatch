// PawMatch Auth Configuration Helper
// This file helps debug and configure authentication URLs

import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

export const AuthConfig = {
  // Get all possible redirect URIs for debugging
  getAllRedirectURIs() {
    const uris = [];
    
    // Expo development URIs
    uris.push(AuthSession.makeRedirectUri({}));
    uris.push(AuthSession.makeRedirectUri({ scheme: 'pawmatch' }));
    uris.push(AuthSession.makeRedirectUri({ scheme: 'pawmatch', path: 'auth/callback' }));
    
    // Environment-based URIs
    if (process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL) {
      uris.push(process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL);
    }
    if (process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL) {
      uris.push(process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL);
    }
    if (process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL) {
      uris.push(process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL);
    }
    
    // Common development ports
    const ports = ['8081', '8082', '8083', '3000'];
    ports.forEach(port => {
      uris.push(`http://localhost:${port}/auth-callback`);
    });
    
    // Remove duplicates
    return [...new Set(uris)];
  },
  
  // Get the correct redirect URI for current platform/environment
  getRedirectURI() {
    if (Platform.OS === 'web') {
      // Web platform
      const envUrl = process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL || process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL;
      if (envUrl) {
        return envUrl;
      }
      
      // Fallback to current origin
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/auth-callback`;
      }
    } else {
      // Mobile platform
      const mobileUrl = process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL;
      if (mobileUrl) {
        return mobileUrl;
      }
      
      // Fallback to Expo's default
      return AuthSession.makeRedirectUri({});
    }
    
    // Final fallback
    return AuthSession.makeRedirectUri({});
  },
  
  // Debug function to log all URIs (only in development)
  logDebugInfo() {
    if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true') {
      console.log('\n🔧 === PawMatch Auth Debug Info ===');
      console.log('Platform:', Platform.OS);
      console.log('Current redirect URI:', this.getRedirectURI());
      console.log('\n📋 Add these URIs to Supabase Dashboard:');
      this.getAllRedirectURIs().forEach((uri, index) => {
        console.log(`${index + 1}. ${uri}`);
      });
      console.log('\n🔗 Supabase Dashboard:');
      console.log('https://supabase.com/dashboard/project/afxkliyukojjymvfwiyp/auth/url-configuration');
      console.log('=================================\n');
    }
  }
};

// Auto-run debug info in development
AuthConfig.logDebugInfo();