import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View, ViewToken } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Screen } from '../../components/ui/Screen';
import { theme } from '../../theme';
import { OnboardingSlide } from './components/OnboardingSlide';
import { OnboardingSlide as OnboardingSlideType } from './onboarding.types';

const SLIDES: OnboardingSlideType[] = [
  {
    id: '1',
    title: 'Secure Payments. Guaranteed Delivery.',
    subtitle: 'We hold your payment securely until you confirm your order is delivered perfectly.',
  },
  {
    id: '2',
    title: 'Escrow Protection',
    subtitle: 'Your money is safe until your product or service is completely delivered.',
  },
  {
    id: '3',
    title: 'Both parties are covered for',
    subtitle: 'Payment is released after product or service delivery is complete.',
  },
  {
    id: '4',
    title: 'Dispute Resolution',
    subtitle: '24/7 support to resolve issues',
  },
];

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  const handleGetStartedPress = () => {
    if (currentIndex === SLIDES.length - 1) {
      router.push('/(auth)/register');
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const renderPaginationDot = (index: number) => {
    const isActive = index === currentIndex;
    return (
      <View
        key={`dot-${index}`}
        style={[
          styles.dot,
          {
            backgroundColor: isActive ? theme.colors.primary : theme.colors.border?.light || '#E6E6E6',
            width: isActive ? 24 : 8,
          },
        ]}
      />
    );
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={({ item }) => <OnboardingSlide slide={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>{SLIDES.map((_, index) => renderPaginationDot(index))}</View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.loginButtonWrapper}>
          <Button title='Log in' onPress={handleLoginPress} variant='secondary' style={styles.loginButton} />
        </View>
        <View style={styles.getStartedButtonWrapper}>
          <Button title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'} onPress={handleGetStartedPress} style={styles.getStartedButton} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  loginButtonWrapper: {
    flex: 3,
  },
  getStartedButtonWrapper: {
    flex: 7,
  },
  loginButton: {
    backgroundColor: theme.colors.background?.tertiary || '#E6E6E6',
  },
  getStartedButton: {
    // Additional styles for get started button if needed
  },
});
