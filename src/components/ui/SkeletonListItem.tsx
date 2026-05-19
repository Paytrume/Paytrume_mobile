import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../../theme';

const SkeletonListItem = () => {
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const shimmerStyle = {
    transform: [{ translateX }],
  };

  return (
    <View style={styles.container}>
      {/* Icon skeleton */}
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
        </Animated.View>
      </View>

      {/* Text content skeleton */}
      <View style={styles.textContainer}>
        {/* Title skeleton */}
        <View style={styles.titleSkeleton}>
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
          </Animated.View>
        </View>
        {/* Description skeleton */}
        <View style={styles.descriptionSkeleton}>
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
          </Animated.View>
        </View>
      </View>

      {/* Right side skeleton */}
      <View style={styles.rightContainer}>
        <View style={styles.amountSkeleton}>
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
          </Animated.View>
        </View>
        <View style={styles.statusSkeleton}>
          <Animated.View style={[styles.shimmer, shimmerStyle]}>
            <LinearGradient colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default SkeletonListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 10,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
  },
  titleSkeleton: {
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
    overflow: 'hidden',
  },
  descriptionSkeleton: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '50%',
    overflow: 'hidden',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  amountSkeleton: {
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
    width: 60,
    overflow: 'hidden',
  },
  statusSkeleton: {
    height: 12,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: 50,
    overflow: 'hidden',
  },
  shimmer: {
    width: 200,
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});
