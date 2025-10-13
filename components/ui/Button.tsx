import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
    styles[`${size}Text` as keyof typeof styles],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyleCombined}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    ...SHADOWS.none,
  },
  danger: {
    backgroundColor: COLORS.error,
  },

  // Sizes - All meet minimum touch target
  small: {
    minHeight: SPACING.minTouchTarget,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  medium: {
    minHeight: SPACING.buttonHeight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },

  // Text styles
  text: {
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.labelLarge.fontFamily,
  },
  primaryText: {
    color: COLORS.textOnPrimary,
    ...TYPOGRAPHY.labelLarge,
  },
  secondaryText: {
    color: COLORS.textPrimary,
    ...TYPOGRAPHY.labelLarge,
  },
  ghostText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.labelLarge,
  },
  dangerText: {
    color: COLORS.textOnPrimary,
    ...TYPOGRAPHY.labelLarge,
  },

  // Size-specific text
  smallText: {
    ...TYPOGRAPHY.labelMedium,
  },
  mediumText: {
    ...TYPOGRAPHY.labelLarge,
  },
  largeText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: TYPOGRAPHY.labelLarge.fontFamily,
  },

  // States
  disabled: {
    backgroundColor: COLORS.gray200,
    ...SHADOWS.none,
  },
  disabledText: {
    color: COLORS.textDisabled,
  },
});
