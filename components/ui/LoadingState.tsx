import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  variant?: 'fullScreen' | 'inline' | 'overlay';
}

export default function LoadingState({ 
  message = 'Loading...', 
  size = 'large',
  variant = 'inline' 
}: LoadingStateProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

// Specific loading states for common scenarios
export function CardLoadingState() {
  return (
    <View style={styles.cardLoading}>
      <View style={styles.cardImagePlaceholder} />
      <View style={styles.cardContentPlaceholder}>
        <View style={styles.titlePlaceholder} />
        <View style={styles.subtitlePlaceholder} />
        <View style={styles.tagPlaceholder} />
      </View>
    </View>
  );
}

export function ListLoadingState({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listLoading}>
      {Array(count).fill(0).map((_, index) => (
        <View key={index} style={styles.listItemPlaceholder}>
          <View style={styles.listImagePlaceholder} />
          <View style={styles.listContentPlaceholder}>
            <View style={styles.listTitlePlaceholder} />
            <View style={styles.listSubtitlePlaceholder} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Variants
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inline: {
    padding: SPACING.xl,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },

  message: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },

  // Card loading placeholder
  cardLoading: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.gray200,
    borderRadius: SPACING.sm,
    marginBottom: SPACING.md,
  },
  cardContentPlaceholder: {
    gap: SPACING.sm,
  },
  titlePlaceholder: {
    height: 20,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    width: '80%',
  },
  subtitlePlaceholder: {
    height: 16,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    width: '60%',
  },
  tagPlaceholder: {
    height: 14,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    width: '40%',
  },

  // List loading placeholder
  listLoading: {
    gap: SPACING.md,
  },
  listItemPlaceholder: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.md,
    gap: SPACING.md,
  },
  listImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.gray200,
    borderRadius: SPACING.sm,
  },
  listContentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  listTitlePlaceholder: {
    height: 16,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    width: '70%',
  },
  listSubtitlePlaceholder: {
    height: 14,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    width: '50%',
  },
});
