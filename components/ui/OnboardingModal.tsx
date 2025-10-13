import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Search, MessageCircle, X } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';
import Button from './Button';

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    icon: <Heart size={60} color={COLORS.primary} fill={COLORS.primary} />,
    title: 'Swipe to Find Love',
    description: 'Swipe right on pets you love, left on ones you\'ll pass. It\'s that simple!',
    tip: 'Tip: Tap on any card to see more details about the pet.'
  },
  {
    icon: <Search size={60} color={COLORS.secondary} />,
    title: 'Discover Amazing Pets',
    description: 'Browse through hundreds of adorable pets from verified shelters near you.',
    tip: 'Tip: Use filters to find pets that match your lifestyle and preferences.'
  },
  {
    icon: <MessageCircle size={60} color={COLORS.success} />,
    title: 'Connect & Adopt',
    description: 'Message shelters directly and start your adoption journey with your perfect match.',
    tip: 'Tip: Be honest about your experience and living situation when messaging shelters.'
  }
];

export default function OnboardingModal({ visible, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed and close
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.surfaceSecondary]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Skip Button */}
          <View style={styles.header}>
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="ghost"
              style={styles.skipButton}
              textStyle={styles.skipButtonText}
            />
            <Button
              title=""
              onPress={handleSkip}
              variant="ghost"
              icon={<X size={24} color={COLORS.textSecondary} />}
              style={styles.closeButton}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              {step.icon}
            </View>

            {/* Title */}
            <Text style={styles.title}>{step.title}</Text>
            
            {/* Description */}
            <Text style={styles.description}>{step.description}</Text>
            
            {/* Tip */}
            <View style={styles.tipContainer}>
              <Text style={styles.tip}>{step.tip}</Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.mockCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&h=200' }}
                  style={styles.mockImage}
                />
                <View style={styles.mockContent}>
                  <Text style={styles.mockName}>Max</Text>
                  <Text style={styles.mockBreed}>Golden Retriever • 2 years</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Progress Indicators */}
            <View style={styles.progressContainer}>
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentStep && styles.progressDotActive
                  ]}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationButtons}>
              {currentStep > 0 && (
                <Button
                  title="Previous"
                  onPress={handlePrevious}
                  variant="secondary"
                  style={styles.navButton}
                />
              )}
              
              <Button
                title={currentStep === onboardingSteps.length - 1 ? "Let's Start!" : "Next"}
                onPress={handleNext}
                variant="primary"
                style={[styles.navButton, styles.nextButton]}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  skipButton: {
    backgroundColor: 'transparent',
    minWidth: 60,
  },
  skipButtonText: {
    color: COLORS.textSecondary,
  },
  closeButton: {
    backgroundColor: 'transparent',
    minWidth: SPACING.minTouchTarget,
  },
  
  // Content
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
    maxWidth: 320,
  },
  tipContainer: {
    backgroundColor: COLORS.primaryLighter + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  tip: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primaryDark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Illustration
  illustrationContainer: {
    marginTop: SPACING.lg,
  },
  mockCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mockImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  mockContent: {
    padding: SPACING.md,
  },
  mockName: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  mockBreed: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  
  // Footer
  footer: {
    paddingVertical: SPACING.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray300,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  navButton: {
    flex: 1,
  },
  nextButton: {
    // Next button takes priority
  },
});
