/**
 * Notification Service
 * Handles push notifications, local notifications, and notification permissions
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '../enhanced-auth';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type?: string;
  petId?: string;
  petName?: string;
  petImage?: string;
  [key: string]: any;
}

class NotificationService {
  private pushToken: string | null = null;
  private isInitialized = false;

  /**
   * Initialize notification service
   * Request permissions and register for push notifications
   */
  async initialize(userId?: string): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      console.log('🔔 [Notifications] Initializing notification service...');

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('⚠️ [Notifications] Permission not granted');
        return false;
      }

      console.log('✅ [Notifications] Permissions granted');

      // Get push token (for remote notifications)
      if (Platform.OS !== 'web') {
        try {
          const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          });
          this.pushToken = tokenData.data;
          console.log('✅ [Notifications] Push token obtained:', this.pushToken.substring(0, 20) + '...');

          // Save token to user profile if userId provided
          if (userId && this.pushToken) {
            await this.savePushToken(userId, this.pushToken);
          }
        } catch (error) {
          console.error('❌ [Notifications] Error getting push token:', error);
          // Continue without push token - local notifications will still work
        }
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('❌ [Notifications] Initialization error:', error);
      return false;
    }
  }

  /**
   * Save push token to user profile in database
   */
  private async savePushToken(userId: string, token: string): Promise<void> {
    try {
      if (!supabase) return;

      // Get current preferences first
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('❌ [Notifications] Error fetching profile:', fetchError);
        return;
      }

      // Merge push token into preferences
      const currentPrefs = (profile?.preferences as Record<string, any>) || {};
      const updatedPrefs = {
        ...currentPrefs,
        push_token: token,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ preferences: updatedPrefs })
        .eq('id', userId);

      if (error) {
        console.error('❌ [Notifications] Error saving push token:', error);
      } else {
        console.log('✅ [Notifications] Push token saved to profile');
      }
    } catch (error) {
      console.error('❌ [Notifications] Error saving push token:', error);
    }
  }

  /**
   * Set up notification event listeners
   */
  private setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 [Notifications] Notification received:', notification.request.content.title);
      // You can update UI here if needed
    });

    // Handle notification tapped/opened
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('🔔 [Notifications] Notification tapped:', response.notification.request.content);
      this.handleNotificationTap(response.notification.request.content.data as NotificationData);
    });
  }

  /**
   * Handle notification tap - navigate to relevant screen
   */
  private handleNotificationTap(data: NotificationData): void {
    // This will be handled by the app's navigation system
    // You can emit an event or use a navigation service here
    console.log('🔔 [Notifications] Handling tap for:', data);
  }

  /**
   * Send a local notification
   */
  async sendLocalNotification(
    title: string,
    body: string,
    data?: NotificationData,
    sound: boolean = true
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: sound,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Show immediately
      });

      console.log('✅ [Notifications] Local notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ [Notifications] Error sending local notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for later
   */
  async scheduleNotification(
    title: string,
    body: string,
    trigger: Date | number, // Date or seconds from now
    data?: NotificationData
  ): Promise<string | null> {
    try {
      const triggerDate = typeof trigger === 'number' 
        ? new Date(Date.now() + trigger * 1000)
        : trigger;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: triggerDate,
      });

      console.log('✅ [Notifications] Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ [Notifications] Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('✅ [Notifications] Notification cancelled:', notificationId);
    } catch (error) {
      console.error('❌ [Notifications] Error cancelling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ [Notifications] All notifications cancelled');
    } catch (error) {
      console.error('❌ [Notifications] Error cancelling all notifications:', error);
    }
  }

  /**
   * Get badge count (unread notifications)
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('❌ [Notifications] Error getting badge count:', error);
      return 0;
    }
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('❌ [Notifications] Error setting badge count:', error);
    }
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

