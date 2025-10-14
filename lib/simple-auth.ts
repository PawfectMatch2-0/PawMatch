/**
 * SIMPLE AUTH SERVICE - No OAuth Complexity
 * Email/Password + Magic Links - Works 100% of the time
 */

import { supabase } from './supabase';
import { Alert } from 'react-native';

export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
  needsVerification?: boolean;
}

class SimpleAuthService {
  // Email/Password Sign Up
  async signUpWithEmail(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { 
          success: true, 
          user: data.user,
          needsVerification: true 
        };
      }

      if (data.session) {
        await this.createOrUpdateProfile(data.session.user);
        return { 
          success: true, 
          user: data.session.user,
          session: data.session 
        };
      }

      return { success: false, error: 'Unexpected response from server' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session) {
        await this.createOrUpdateProfile(data.session.user);
        return { 
          success: true, 
          user: data.session.user,
          session: data.session 
        };
      }

      return { success: false, error: 'No session created' };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Magic Link Sign In (No password needed)
  async signInWithMagicLink(email: string): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: undefined // Keep it simple - no redirects
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        needsVerification: true
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sign Out
  async signOut(): Promise<AuthResponse> {
    try {
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get Current Session
  async getCurrentSession() {
    try {
      if (!supabase) return null;
      
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Create/Update User Profile
  async createOrUpdateProfile(user: any) {
    try {
      if (!supabase || !user) return;

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const profileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', user.id);
      } else {
        await supabase
          .from('user_profiles')
          .insert({
            ...profileData,
            created_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}

export const simpleAuth = new SimpleAuthService();