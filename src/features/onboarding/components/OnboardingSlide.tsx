import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { theme } from '../../../theme';
import { OnboardingSlide as OnboardingSlideType } from '../onboarding.types';

const { width } = Dimensions.get('window');

interface Props {
  slide: OnboardingSlideType;
}

// Import PNG images
const IMAGES = {
  '1': require('../../../../assets/images/card.png'),
  '2': require('../../../../assets/images/lock.png'),
  '3': require('../../../../assets/images/handshake.png'),
  '4': require('../../../../assets/images/mobile-payments.png'),
};

export const OnboardingSlide: React.FC<Props> = ({ slide }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={IMAGES[slide.id as keyof typeof IMAGES]} style={styles.image} resizeMode='contain' />
      </View>

      <View style={styles.contentContainer}>
        <Text variant='h2' style={styles.title}>
          {slide.title}
        </Text>
        <Text variant='body' style={styles.subtitle}>
          {slide.subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    minHeight: 200,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  contentContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  title: {
    textAlign: 'left',
    marginBottom: 16,
    color: theme.colors.text.primary,
    fontSize: 40,
  },
  subtitle: {
    textAlign: 'left',
    lineHeight: 24,
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
});
