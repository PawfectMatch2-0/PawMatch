// PawMatch Design System
// Consistent theme tokens for the entire app

export const COLORS = {
  // Primary Brand Colors
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryLighter: '#FFB3B3',
  primaryDark: '#E55A5A',
  
  // Secondary Colors
  secondary: '#4A90E2',
  secondaryLight: '#6BA3E8',
  secondaryDark: '#3A7BC0',
  
  // Semantic Colors
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  // Background Colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  
  // Text Colors
  textPrimary: '#171717',
  textSecondary: '#525252',
  textTertiary: '#737373',
  textDisabled: '#A3A3A3',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  
  // Border Colors
  border: 'rgba(0,0,0,0.1)',
  borderLight: 'rgba(0,0,0,0.05)',
  borderStrong: 'rgba(0,0,0,0.2)',
  
  // Shadow Colors
  shadow: 'rgba(0,0,0,0.1)',
  shadowStrong: 'rgba(0,0,0,0.2)',
} as const;

export const TYPOGRAPHY = {
  // Font Families
  fontPrimary: 'Poppins-Regular',
  fontPrimaryMedium: 'Poppins-Medium',
  fontPrimarySemiBold: 'Poppins-SemiBold',
  fontPrimaryBold: 'Poppins-Bold',
  
  fontSecondary: 'Nunito-Regular',
  fontSecondarySemiBold: 'Nunito-SemiBold',
  fontSecondaryBold: 'Nunito-Bold',
  
  // Font Sizes - Mobile First with clear hierarchy
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Poppins-Bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Poppins-Bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Poppins-SemiBold',
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  h5: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
  },
  h6: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Body Text
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Nunito-Regular',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito-Regular',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Nunito-Regular',
  },
  
  // Labels
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito-SemiBold',
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Nunito-SemiBold',
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  
  // Caption
  caption: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Nunito-Regular',
  },
} as const;

export const SPACING = {
  // Base spacing scale (8px base)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Component specific spacing
  componentPadding: 16,
  cardPadding: 16,
  screenPadding: 20,
  sectionSpacing: 24,
  
  // Touch targets
  minTouchTarget: 44,
  buttonHeight: 48,
  inputHeight: 56,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

export const ANIMATION = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
} as const;

// Helper functions for consistent styling
export const getTextStyle = (variant: keyof typeof TYPOGRAPHY) => ({
  ...TYPOGRAPHY[variant],
  color: COLORS.textPrimary,
});

export const getButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  const baseStyle = {
    minHeight: SPACING.minTouchTarget,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    flexDirection: 'row' as const,
    ...SHADOWS.sm,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: COLORS.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        ...SHADOWS.none,
      };
    default:
      return baseStyle;
  }
};

export const getCardStyle = () => ({
  backgroundColor: COLORS.surface,
  borderRadius: BORDER_RADIUS.lg,
  padding: SPACING.componentPadding,
  ...SHADOWS.md,
});

// Export default theme object
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
};

export default theme;
