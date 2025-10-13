import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Clock, AlertCircle, Heart } from 'lucide-react-native';
import { AdoptionFlowStatus, ADOPTION_FLOW_STEPS, getStatusProgress } from '@/types/adoption';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';

interface AdoptionFlowTrackerProps {
  status: AdoptionFlowStatus;
  petName?: string;
  onViewDetails?: () => void;
  compact?: boolean;
}

export default function AdoptionFlowTracker({ 
  status, 
  petName = 'this pet', 
  onViewDetails,
  compact = false 
}: AdoptionFlowTrackerProps) {
  const stepInfo = ADOPTION_FLOW_STEPS[status];
  const progress = getStatusProgress(status);

  const getStatusIcon = () => {
    switch (status) {
      case AdoptionFlowStatus.LIKED:
      case AdoptionFlowStatus.MATCHED:
        return <Heart size={20} color={COLORS.primary} fill={COLORS.primary} />;
      case AdoptionFlowStatus.ADOPTED:
      case AdoptionFlowStatus.APPROVED:
        return <Check size={20} color={COLORS.success} />;
      case AdoptionFlowStatus.REJECTED:
      case AdoptionFlowStatus.WITHDRAWN:
        return <AlertCircle size={20} color={COLORS.error} />;
      default:
        return <Clock size={20} color={COLORS.warning} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case AdoptionFlowStatus.ADOPTED:
      case AdoptionFlowStatus.APPROVED:
        return COLORS.success;
      case AdoptionFlowStatus.REJECTED:
      case AdoptionFlowStatus.WITHDRAWN:
        return COLORS.error;
      case AdoptionFlowStatus.LIKED:
      case AdoptionFlowStatus.MATCHED:
        return COLORS.primary;
      default:
        return COLORS.warning;
    }
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onViewDetails}>
        <View style={styles.compactHeader}>
          {getStatusIcon()}
          <Text style={styles.compactTitle}>{stepInfo.title}</Text>
        </View>
        <Text style={styles.compactPetName}>{petName}</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progress}%`, backgroundColor: getStatusColor() }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[getStatusColor() + '20', getStatusColor() + '10']}
        style={styles.cardBackground}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getStatusIcon()}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{stepInfo.title}</Text>
            <Text style={styles.petName}>for {petName}</Text>
          </View>
          <Text style={[styles.progressBadge, { backgroundColor: getStatusColor() }]}>
            {progress}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progress}%`, backgroundColor: getStatusColor() }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{stepInfo.description}</Text>

        {/* Timeline */}
        {stepInfo.timelineEstimate && (
          <View style={styles.timelineContainer}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={styles.timelineText}>{stepInfo.timelineEstimate}</Text>
          </View>
        )}

        {/* Next Actions */}
        {stepInfo.nextActions.length > 0 && (
          <View style={styles.actionsSection}>
            <Text style={styles.actionsTitle}>Next Steps:</Text>
            {stepInfo.nextActions.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <View style={styles.actionBullet} />
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>
        )}

        {/* View Details Button */}
        {onViewDetails && (
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
            <Text style={styles.detailsButtonText}>View Full Details</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full Card Styles
  card: {
    marginHorizontal: SPACING.screenPadding,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  cardBackground: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h5,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  petName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  progressBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  
  // Progress Section
  progressSection: {
    marginBottom: SPACING.md,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...TYPOGRAPHY.labelSmall,
    color: COLORS.textSecondary,
    minWidth: 30,
  },
  
  // Content
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  timelineText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  
  // Actions
  actionsSection: {
    marginBottom: SPACING.md,
  },
  actionsTitle: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginRight: SPACING.sm,
  },
  actionText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  
  // Details Button
  detailsButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  detailsButtonText: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.primary,
  },

  // Compact Card Styles
  compactCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  compactTitle: {
    ...TYPOGRAPHY.labelLarge,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  compactPetName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
});

