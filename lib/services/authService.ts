/**
 * Auth Service - Simplified authentication operations
 */

import { supabase, authService as legacyAuthService, UserProfile } from '../supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpData): Promise<{ user: any; error: any }> {
    if (!supabase) {
      return {
        user: null,
        error: { message: 'Supabase not configured' }
      };
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        return { user: null, error };
      }

      console.log('✅ User signed up successfully:', authData.user?.email);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('💥 Exception during sign up:', error);
      return {
        user: null,
        error: { message: 'An unexpected error occurred' }
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<{ user: any; error: any }> {
    if (!supabase) {
      return {
        user: null,
        error: { message: 'Supabase not configured' }
      };
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { user: null, error };
      }

      console.log('✅ User signed in successfully:', authData.user?.email);
      return { user: authData.user, error: null };
    } catch (error) {
      console.error('💥 Exception during sign in:', error);
      return {
        user: null,
        error: { message: 'An unexpected error occurred' }
      };
    }
  },

  /**
   * Sign in with Google (OAuth)
   */
  async signInWithGoogle() {
    return legacyAuthService.signInWithGoogle();
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: any }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } };
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out error:', error);
        return { error };
      }

      console.log('✅ User signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Exception during sign out:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('💥 Exception getting current user:', error);
      return null;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    if (!supabase) {
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('💥 Exception getting session:', error);
      return null;
    }
  },

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return legacyAuthService.getUserProfile(userId);
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      return await legacyAuthService.updateUserProfile(userId, updates);
    } catch (error) {
      console.error('💥 Exception updating profile:', error);
      return null;
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: any }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('❌ Reset password error:', error);
        return { error };
      }

      console.log('✅ Password reset email sent to:', email);
      return { error: null };
    } catch (error) {
      console.error('💥 Exception during password reset:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  },

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: any }> {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Update password error:', error);
        return { error };
      }

      console.log('✅ Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Exception during password update:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  }
};
