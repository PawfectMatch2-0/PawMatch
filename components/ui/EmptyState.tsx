import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Search, Bookmark, MessageCircle, Wifi } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';
import Button from './Button';

interface EmptyStateProps {
  variant: 'noPets' | 'noSaved' | 'noResults' | 'noApplications' | 'offline' | 'custom';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  variant,
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  const config = getEmptyStateConfig(variant);
  
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || config.actionText;
  const finalIcon = icon || config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {finalIcon}
      </View>
      
      <Text style={styles.title}>{finalTitle}</Text>
      <Text style={styles.description}>{finalDescription}</Text>
      
      {onAction && finalActionText && (
        <Button
          title={finalActionText}
          onPress={onAction}
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

function getEmptyStateConfig(variant: EmptyStateProps['variant']) {
  switch (variant) {
    case 'noPets':
      return {
        title: 'No pets available',
        description: 'There are no pets matching your criteria right now. Try adjusting your filters or check back later.',
        actionText: 'Adjust Filters',
        icon: <Heart size={48} color={COLORS.gray400} />,
      };
    
    case 'noSaved':
      return {
        title: 'No saved pets yet',
        description: 'Start swiping right on pets you love to save them here. Your favorites will appear in this list.',
        actionText: 'Discover Pets',
        icon: <Bookmark size={48} color={COLORS.gray400} />,
      };
    
    case 'noResults':
      return {
        title: 'No results found',
        description: 'We couldn\'t find anything matching your search. Try different keywords or browse all content.',
        actionText: 'Clear Search',
        icon: <Search size={48} color={COLORS.gray400} />,
      };
    
    case 'noApplications':
      return {
        title: 'No applications yet',
        description: 'You haven\'t applied to adopt any pets yet. Find your perfect companion and submit an application!',
        actionText: 'Find Pets',
        icon: <MessageCircle size={48} color={COLORS.gray400} />,
      };
    
    case 'offline':
      return {
        title: 'You\'re offline',
        description: 'Please check your internet connection and try again. Some features may not be available offline.',
        actionText: 'Try Again',
        icon: <Wifi size={48} color={COLORS.gray400} />,
      };
    
    default:
      return {
        title: 'Nothing here yet',
        description: 'This section is empty right now.',
        actionText: 'Go Back',
        icon: <Heart size={48} color={COLORS.gray400} />,
      };
  }
}

// Specialized empty states for specific screens
export function NoPetsEmptyState({ onAdjustFilters }: { onAdjustFilters: () => void }) {
  return (
    <EmptyState
      variant="noPets"
      onAction={onAdjustFilters}
    />
  );
}

export function NoSavedPetsEmptyState({ onDiscoverPets }: { onDiscoverPets: () => void }) {
  return (
    <EmptyState
      variant="noSaved"
      onAction={onDiscoverPets}
    />
  );
}

export function SearchEmptyState({ searchQuery, onClearSearch }: { 
  searchQuery: string; 
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      variant="noResults"
      title="No results found"
      description={`We couldn't find anything for "${searchQuery}". Try different keywords or browse all content.`}
      actionText="Clear Search"
      onAction={onClearSearch}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxxl,
  },
  
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  
  actionButton: {
    minWidth: 160,
  },
});
