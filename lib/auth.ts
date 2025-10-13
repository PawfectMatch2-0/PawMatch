import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { AuthConfig } from './auth-config';

// Initialize WebBrowser for expo-auth-session
WebBrowser.maybeCompleteAuthSession();

/**
 * PawMatch Auth Service
 * 
 * Provides authentication methods for both mobile and web platforms
 * Mobile: Uses WebBrowser for OAuth flow
 * Web: Uses direct Supabase OAuth with custom redirects based on port
 */
export const Auth = {
  // Internal state properties
  _authState: null as string | null,
  
  /**
   * Generate a secure state parameter for CSRF protection
   */
  _generateState() {
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().getTime().toString();
    return random + timestamp;
  },
  /**
   * Sign in with Google OAuth
   * Uses different flows for web and mobile platforms
   */
  async signInWithGoogle() {
    try {
      console.log(`🔐 Starting Google sign-in on ${Platform.OS} platform`);
      
      // === WEB PLATFORM FLOW ===
      // Check if running in a web browser environment
      if (Platform.OS === 'web' || typeof window !== 'undefined' && window.document) {
        console.log('🔐 Using web authentication flow');
        return this.webSignIn();
      }
      
      // === MOBILE PLATFORM FLOW ===
      console.log('🔐 Using mobile authentication flow');
      return this.mobileSignIn();
    } catch (error) {
      console.error('❌ Auth error:', error);
      throw error;
    }
  },

  /**
   * Web platform authentication flow
   * Uses AuthConfig helper to get correct redirect URL
   */
  async webSignIn() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Generate state parameter for CSRF protection
    this._authState = this._generateState();
    
    // Get the correct redirect URL using our helper
    const redirectTo = AuthConfig.getRedirectURI();
    
    console.log('🔐 Using redirect URL:', redirectTo);
    console.log('🔐 Using state:', this._authState);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          state: this._authState // Add state parameter for security
        }
      },
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Mobile platform authentication flow
   * Uses WebBrowser for OAuth with app-specific redirect
   */
  async mobileSignIn() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    console.log('� Starting mobile OAuth flow');
    
    // Generate state for CSRF protection
    this._authState = this._generateState();
    
    // Use AuthConfig to get the correct mobile redirect URL
    const redirectUrl = AuthConfig.getRedirectURI();
    
    console.log('� Using mobile redirect URL:', redirectUrl);
    console.log('� Using state:', this._authState);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          state: this._authState
        }
      },
    });
    
    if (error) throw error;
    
    console.log('📱 OAuth flow initiated successfully');
    return data;
  },

  /**
   * Verify if a session was created after OAuth flow
   * Tries multiple times with increasing delays
   */
  async verifySession(maxAttempts = 5, initialDelay = 1000) {
    console.log('🔐 Verifying authentication session');
    
    // Wait for the initial delay
    await new Promise(resolve => setTimeout(resolve, initialDelay));
    
    // Try multiple times with increasing delays
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔐 Session check attempt ${attempt}/${maxAttempts}`);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session verification error:', error);
        if (attempt === maxAttempts) throw error;
      }
      
      if (data?.session) {
        console.log('✅ Session verified successfully!');
        return { 
          success: true, 
          session: data.session,
          user: data.session.user
        };
      }
      
      if (attempt < maxAttempts) {
        const delay = initialDelay * (attempt + 1);
        console.log(`🔐 No session found, waiting ${delay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Authentication was not completed after multiple attempts');
  },
  
  /**
   * Sign out the current user
   */
  async signOut() {
    console.log('🔐 Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },
  
  /**
   * Get the current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },
  
  /**
   * Get the current user
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }
};
