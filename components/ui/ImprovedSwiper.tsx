import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.65;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_STRENGTH = 0.1;

interface SwiperProps {
  data: any[];
  currentIndex: number;
  renderCard: (item: any, index: number) => React.ReactNode;
  onSwipeLeft: (item: any, index: number) => void;
  onSwipeRight: (item: any, index: number) => void;
  onCardPress?: (item: any, index: number) => void;
}

export default function ImprovedSwiper({
  data,
  currentIndex,
  renderCard,
  onSwipeLeft,
  onSwipeRight,
  onCardPress
}: SwiperProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeLeft = () => {
    if (currentIndex < data.length) {
      onSwipeLeft(data[currentIndex], currentIndex);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex < data.length) {
      onSwipeRight(data[currentIndex], currentIndex);
    }
  };

  const resetCard = () => {
    translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    rotate.value = withSpring(0, { damping: 15, stiffness: 100 });
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.2; // Limit vertical movement
      
      // Rotation based on horizontal movement
      rotate.value = interpolate(
        translateX.value,
        [-width, 0, width],
        [-20, 0, 20],
        Extrapolate.CLAMP
      ) * ROTATION_STRENGTH;
      
      // Scale slightly when dragging
      const dragDistance = Math.abs(translateX.value);
      scale.value = interpolate(
        dragDistance,
        [0, width * 0.3],
        [1, 0.95],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      'worklet';
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const velocity = event.velocityX;

      // Consider velocity for more responsive swiping
      const velocityThreshold = 500;
      const fastSwipeLeft = velocity < -velocityThreshold;
      const fastSwipeRight = velocity > velocityThreshold;

      if (shouldSwipeLeft || fastSwipeLeft) {
        // Animate off screen to the left
        translateX.value = withTiming(-width * 1.5, { duration: 200 });
        rotate.value = withTiming(-30, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 }, () => {
          runOnJS(handleSwipeLeft)();
        });
      } else if (shouldSwipeRight || fastSwipeRight) {
        // Animate off screen to the right
        translateX.value = withTiming(width * 1.5, { duration: 200 });
        rotate.value = withTiming(30, { duration: 200 });
        scale.value = withTiming(0.8, { duration: 200 }, () => {
          runOnJS(handleSwipeRight)();
        });
      } else {
        // Snap back to center
        runOnJS(resetCard)();
      }
    });

  // Animation styles for the top card
  const topCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    zIndex: 10,
  }));

  // Simplified card behind styles (static for now, can be enhanced later)
  const getCardBehindStyle = (relativeIndex: number) => {
    const cardsBehind = relativeIndex;
    if (cardsBehind <= 0 || cardsBehind > 2) return { opacity: 0 };

    const baseScale = 1 - (cardsBehind * 0.05);
    const baseTranslateY = cardsBehind * 8;

    return {
      transform: [
        { scale: baseScale },
        { translateY: baseTranslateY },
      ],
      zIndex: 10 - cardsBehind,
      opacity: cardsBehind === 1 ? 1 : 0.7,
    };
  };

  // Like/Pass indicators
  const likeIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, width * 0.3],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, width * 0.3],
          [0.8, 1.2],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const passIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-width * 0.3, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-width * 0.3, 0],
          [1.2, 0.8],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  if (!data.length || currentIndex >= data.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Render cards in reverse order so the top card is rendered last */}
      {data.slice(currentIndex, currentIndex + 3).map((item, relativeIndex) => {
        const absoluteIndex = currentIndex + relativeIndex;
        const isTopCard = relativeIndex === 0;

        if (isTopCard) {
          // Top card with gesture handling
          return (
            <GestureDetector key={absoluteIndex} gesture={panGesture}>
              <Animated.View style={[styles.cardContainer, topCardStyle]}>
                {renderCard(item, absoluteIndex)}
                
                {/* Like Indicator */}
                <Animated.View style={[styles.likeIndicator, likeIndicatorStyle]}>
                  <Animated.Text style={styles.indicatorText}>LIKE ❤️</Animated.Text>
                </Animated.View>
                
                {/* Pass Indicator */}
                <Animated.View style={[styles.passIndicator, passIndicatorStyle]}>
                  <Animated.Text style={styles.indicatorText}>PASS 👎</Animated.Text>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          );
        } else {
          // Cards behind (static but responsive to top card movement)
          return (
            <Animated.View
              key={absoluteIndex}
              style={[styles.cardContainer, getCardBehindStyle(relativeIndex)]}
              pointerEvents="none"
            >
              {renderCard(item, absoluteIndex)}
            </Animated.View>
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  },
  likeIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  passIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  indicatorText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
