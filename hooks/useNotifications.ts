/**
 * React Hook for Notifications
 * Provides easy access to notification functionality
 */

import { useEffect, useState } from 'react';
import { notificationService } from '@/lib/services/notificationService';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      if (user?.id) {
        const success = await notificationService.initialize(user.id);
        setIsInitialized(success);
        
        if (success) {
          const enabled = await notificationService.areNotificationsEnabled();
          setIsEnabled(enabled);
        }
      }
    };

    initializeNotifications();
  }, [user?.id]);

  return {
    isEnabled,
    isInitialized,
    sendNotification: notificationService.sendLocalNotification.bind(notificationService),
    scheduleNotification: notificationService.scheduleNotification.bind(notificationService),
    cancelNotification: notificationService.cancelNotification.bind(notificationService),
    cancelAllNotifications: notificationService.cancelAllNotifications.bind(notificationService),
    getBadgeCount: notificationService.getBadgeCount.bind(notificationService),
    setBadgeCount: notificationService.setBadgeCount.bind(notificationService),
    getPushToken: notificationService.getPushToken.bind(notificationService),
  };
}

