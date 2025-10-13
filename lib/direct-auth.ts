/**
 * direct-auth.ts - A minimal, direct implementation for Google OAuth authentication
 * 
 * This is a simplified version that uses hardcoded values and focuses on the core auth flow,
 * eliminating complexity to help identify and fix redirect issues.
 */

import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Initialize the WebBrowser module
WebBrowser.maybeCompleteAuthSession();

// Environment configuration
const IS_PRODUCTION = process.env.APP_ENV === 'production' || !__DEV__;
// Get the environment variables or use fallbacks
const DEV_IP_ADDRESS = Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_IP_ADDRESS || process.env.EXPO_PUBLIC_DEV_IP_ADDRESS || '192.168.68.106';

// Production URLs - Expo deployment domain
const PRODUCTION_WEB_URL = 'https://pawfectmatch.expo.app';
const PRODUCTION_DEEP_LINK = 'pawmatch://oauth/callback';

const getAuthRedirectUrl = (platform: string) => {
  if (IS_PRODUCTION) {
    return platform === 'web' ? `${PRODUCTION_WEB_URL}/auth/callback` : PRODUCTION_DEEP_LINK;
  } else {
    // Development URLs
    return platform === 'web' 
      ? process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || 'http://localhost:8081/assets/web/auth-callback.html'
      : process.env.EXPO_PUBLIC_AUTH_MOBILE_REDIRECT_URL || 'pawmatch://auth-callback';
  }
};

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a direct Supabase client with Site URL override
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // Force the site URL to use the correct port
      flowType: 'pkce',
      // Custom storage to add debugging
      storage: {
        getItem: async (key) => {
          console.log('🔹 [Direct Auth] Getting storage item:', key);
          try {
            if (typeof localStorage !== 'undefined') {
              return localStorage.getItem(key);
            }
            return null;
          } catch (error) {
            console.error('🔹 [Direct Auth] Storage error:', error);
            return null;
          }
        },
        setItem: async (key, value) => {
          console.log('🔹 [Direct Auth] Setting storage item:', key);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(key, value);
            }
          } catch (error) {
            console.error('🔹 [Direct Auth] Storage error:', error);
          }
        },
        removeItem: async (key) => {
          console.log('🔹 [Direct Auth] Removing storage item:', key);
          try {
            if (typeof localStorage !== 'undefined') {
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('🔹 [Direct Auth] Storage error:', error);
          }
        }
      }
    },
    // This is the most important setting to prevent port 3000 redirects
    global: {
      headers: {
        'x-application-name': 'pawmatch'
      }
    }
  }
);

/**
 * Simple Google sign-in implementation with minimal code
 */
export const directSignInWithGoogle = async () => {
  console.log('🔹 [Direct Auth] Starting Google sign-in on', Platform.OS);
  
  try {
    // IMPORTANT: Use different redirect URLs depending on platform
    let redirectUrl = '';
    
    if (Platform.OS === 'web') {
      if (IS_PRODUCTION) {
        redirectUrl = getAuthRedirectUrl('web');
      } else {
        // Web platform: Use current port dynamically for development
        const currentPort = typeof window !== 'undefined' ? (window.location.port || '8081') : '8081';
        redirectUrl = `http://localhost:${currentPort}/assets/web/auth-callback.html`;
      }
      console.log('🔹 [Direct Auth] Using web redirect URL:', redirectUrl);
    } else if (Platform.OS === 'android') {
      redirectUrl = getAuthRedirectUrl('android');
      console.log('🔹 [Direct Auth] Using Android redirect URL:', redirectUrl);
    } else {
      // iOS or other: Use native deep linking
      redirectUrl = getAuthRedirectUrl('ios');
      console.log('🔹 [Direct Auth] Using iOS redirect URL:', redirectUrl);
    }
    
    console.log('🔹 [Direct Auth] Using redirect URL:', redirectUrl);
    
    // Create a new supabase client just for this auth request with fixed site URL
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { 
          flowType: 'pkce',
          detectSessionInUrl: false
        }
      }
    );
    
    // Get the authentication URL from Supabase
    const { data, error } = await authClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        skipBrowserRedirect: true // Important: we'll handle the redirect ourselves
      }
    });
    
    if (error) throw error;
    if (!data?.url) throw new Error('No authentication URL provided');
    
    console.log('🔹 [Direct Auth] Got auth URL from Supabase:', data.url);
    
    if (Platform.OS === 'web') {
      // For web, we need to manually extract the port from the current URL
      // and add it to the OAuth URL to ensure it redirects back to the same port
      try {
        // Extract the current port
        const currentPort = window.location.port || '8082';
        console.log('🔹 [Direct Auth] Current port:', currentPort);
        
        // Parse the OAuth URL
        const oauthUrl = new URL(data.url);
        
        // Get the redirect_to parameter from the OAuth URL
        const redirectToParam = oauthUrl.searchParams.get('redirect_to');
        
        if (redirectToParam) {
          // Parse the redirect_to URL
          const redirectToUrl = new URL(decodeURIComponent(redirectToParam));
          
          // Force the port to match the current port
          redirectToUrl.port = currentPort;
          
          // Update the redirect_to parameter in the OAuth URL
          oauthUrl.searchParams.set('redirect_to', redirectToUrl.toString());
          
          console.log('🔹 [Direct Auth] Modified redirect_to:', redirectToUrl.toString());
          console.log('🔹 [Direct Auth] Modified OAuth URL:', oauthUrl.toString());
          
          // Redirect to the modified OAuth URL
          window.location.href = oauthUrl.toString();
        } else {
          // Fallback to the original URL if no redirect_to parameter
          window.location.href = data.url;
        }
      } catch (e) {
        console.error('🔹 [Direct Auth] Error modifying URL:', e);
        // Fallback to the original URL
        window.location.href = data.url;
      }
      
      return { type: 'web' };
    } else {
      // For mobile, open the browser to handle OAuth
      console.log('🔹 [Direct Auth] Mobile platform: Opening WebBrowser with URL', data.url);
      
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl, {
        showInRecents: true,
        createTask: true,
        preferEphemeralSession: false
      });
      
      console.log('🔹 [Direct Auth] WebBrowser result type:', result.type);
      
      if (result.type === 'success') {
        console.log('🔹 [Direct Auth] Auth success, getting session');
        return await checkSession();
      } else {
        throw new Error(`Authentication cancelled or failed: ${result.type}`);
      }
    }
  } catch (error) {
    console.error('🔹 [Direct Auth] Error:', error);
    throw error;
  }
};

/**
 * Check if we have a valid session after authentication
 */
const checkSession = async () => {
  console.log('🔹 [Direct Auth] Checking for session');
  
  // Wait a moment for the session to be established
  // Android on external device might need a longer initial delay
  const initialDelay = Platform.OS === 'android' ? 2000 : 1000;
  await new Promise(resolve => setTimeout(resolve, initialDelay));
  
  // Try up to 3 times with increasing delays
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`🔹 [Direct Auth] Session check attempt ${attempt}/3`);
    
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.error('🔹 [Direct Auth] Session check error:', error);
      if (attempt === 3) throw error;
    }
    
    if (data?.session) {
      console.log('🔹 [Direct Auth] Session found:', data.session.user.email);
      return {
        success: true,
        session: data.session,
        user: data.session.user
      };
    }
    
    if (attempt < 3) {
      // Longer delays for Android
      const delay = Platform.OS === 'android' ? 2000 * attempt : 1000 * attempt;
      console.log(`🔹 [Direct Auth] No session yet, waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('No session established after multiple attempts');
};

/**
 * Sign out the current user
 */
const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
  return { success: true };
};

/**
 * Export as DirectAuth object
 */
export const DirectAuth = {
  signInWithGoogle: directSignInWithGoogle,
  signOut,
  getSession: async () => await supabaseClient.auth.getSession(),
  getUser: async () => {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  }
};
